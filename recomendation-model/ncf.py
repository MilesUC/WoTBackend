import os
import sagemaker
import argparse
import pandas as pd
import numpy as np
import tensorflow as tf
import json

def _get_user_embedding_layers(inputs, emb_dim):  
    """ create user embeddings """  
    user_gmf_emb = tf.keras.layers.Dense(emb_dim, activation='relu')(inputs)  
    user_mlp_emb = tf.keras.layers.Dense(emb_dim, activation='relu')(inputs)  
    return user_gmf_emb, user_mlp_emb  
  
def _get_item_embedding_layers(inputs, emb_dim):  
    """ create item embeddings """  
    item_gmf_emb = tf.keras.layers.Dense(emb_dim, activation='relu')(inputs)  
    item_mlp_emb = tf.keras.layers.Dense(emb_dim, activation='relu')(inputs)  
    return item_gmf_emb, item_mlp_emb  

def _gmf(user_emb, item_emb):  
    """ general matrix factorization branch """  
    gmf_mat = tf.keras.layers.Multiply()([user_emb, item_emb])  
    return gmf_mat  

def _mlp(user_emb, item_emb, dropout_rate):  
    """ multi-layer perceptron branch """  
    def add_layer(dim, input_layer, dropout_rate):  
        hidden_layer = tf.keras.layers.Dense(dim, activation='relu')(input_layer)  
        if dropout_rate:  
            dropout_layer = tf.keras.layers.Dropout(dropout_rate)(hidden_layer)  
            return dropout_layer  
        return hidden_layer  
  
    concat_layer = tf.keras.layers.Concatenate()([user_emb, item_emb])  
    dropout_l1 = tf.keras.layers.Dropout(dropout_rate)(concat_layer)  
    dense_layer_1 = add_layer(64, dropout_l1, dropout_rate)  
    dense_layer_2 = add_layer(32, dense_layer_1, dropout_rate)  
    dense_layer_3 = add_layer(16, dense_layer_2, None)  
    dense_layer_4 = add_layer(8, dense_layer_3, None)  
    return dense_layer_4  

def _neuCF(gmf, mlp, dropout_rate):  
    """ final output layer """  
    concat_layer = tf.keras.layers.Concatenate()([gmf, mlp])  
    output_layer = tf.keras.layers.Dense(1, activation='sigmoid')(concat_layer)  
    return output_layer  

def build_graph(user_dim, item_dim, dropout_rate=0.25):  
    user_input = tf.keras.Input(shape=(user_dim))
    item_input = tf.keras.Input(shape=(item_dim))
  
    # create embedding layers  
    user_gmf_emb, user_mlp_emb = _get_user_embedding_layers(user_input, 32)  
    item_gmf_emb, item_mlp_emb = _get_item_embedding_layers(item_input, 32)  
  
    # general matrix factorization  
    gmf = _gmf(user_gmf_emb, item_gmf_emb)  
  
    # multi layer perceptron  
    mlp = _mlp(user_mlp_emb, item_mlp_emb, dropout_rate)  
  
    # output  
    output = _neuCF(gmf, mlp, dropout_rate)  
  
    # create the model
    model = tf.keras.Model(inputs=[user_input, item_input], outputs=output)  
  
    return model

def model(user_train, item_train, y_train, user_test, item_test, y_test, epochs, batch_size):
    ncf_model = build_graph(len(user_train[0]), len(item_train[0]))
    ncf_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])  
    ncf_model.fit([user_train, item_train], y_train, epochs=epochs, batch_size=batch_size, verbose=1)
    ncf_model.evaluate([user_test, item_test], y_test)
    
    return ncf_model

def _load_training_data(base_dir):
    df_train = np.load(os.path.join(base_dir, 'interactions_train.npy'), allow_pickle=True)
    user_train, item_train, y_train = np.split(np.transpose(df_train).flatten(), 3)
    y_train = np.asarray(y_train).astype(np.float32)
    return user_train, item_train, y_train

def _load_testing_data(base_dir):  
    df_test = np.load(os.path.join(base_dir, 'interactions_test.npy'), allow_pickle=True)  
    user_test, item_test, y_test = np.split(np.transpose(df_test).flatten(), 3)
    y_test = np.asarray(y_test).astype(np.float32)
    return user_test, item_test, y_test 

def _load_users_data(base_dir):
    users_vectors_df = pd.read_csv(os.path.join(base_dir, 'users_vectors.csv'))
    users_vectors_df = users_vectors_df.set_index('id')
    return users_vectors_df

def _load_interactions_data(base_dir):
    interactions_df = pd.read_csv(os.path.join(base_dir, 'interactions.csv'))
    interactions_df = interactions_df.set_index('userId')
    return interactions_df

def _replace_user_ids_for_vectors(user_train, user_test, users_vectors_df, interactions_df):
    for i in range(len(user_train)):
        user_vector = users_vectors_df.loc[user_train[i]].values.tolist()
        interaction_vector = interactions_df.loc[user_train[i]].values.tolist()
        user_train[i] = user_vector + interaction_vector
       
    for i in range(len(user_test)):
        user_vector = users_vectors_df.loc[user_test[i]].values.tolist()
        interaction_vector = interactions_df.loc[user_test[i]].values.tolist()
        user_test[i] = user_vector + interaction_vector
    
    user_train = np.array(user_train.tolist())
    user_test = np.array(user_test.tolist())
      
    return user_train, user_test

def _one_hot_items(item_train, item_test, n_items):
    # one-hot encode the testing data for model input  
    for i in range(len(item_train)):
        item_train[i] = str(int(item_train[i])-1)
    for i in range(len(item_test)):
        item_test[i] = str(int(item_test[i])-1)
    with tf.compat.v1.Session() as tf_sess:
        item_train = np.array(tf_sess.run(tf.one_hot(item_train, depth=n_items)).tolist())
        item_test = np.array(tf_sess.run(tf.one_hot(item_test, depth=n_items)).tolist())

    return item_train, item_test

if __name__ == "__main__":
    # hyperparameters sent by the client are passed as command-line arguments to the script.
    parser = argparse.ArgumentParser()
    parser.add_argument('--model_dir', type=str)
    parser.add_argument('--sm-model-dir', type=str, default=os.environ.get('SM_MODEL_DIR'))
    parser.add_argument('--epochs', type=int, default=1)
    parser.add_argument("--batch_size", type=int, default=256)
    parser.add_argument("--n_items", type=int, default=62)
    parser.add_argument('--train', type=str, default=os.environ.get('SM_CHANNEL_TRAINING'))
    args, _ = parser.parse_known_args()
    
    
    # load training and testinf data
    print("Loading data")
    user_train, item_train, y_train = _load_training_data(args.train)
    user_test, item_test, y_test = _load_testing_data(args.train)
    users_vectors_df = _load_users_data(args.train)
    interactions_df = _load_interactions_data(args.train)
    user_train, user_test = _replace_user_ids_for_vectors(user_train, user_test, users_vectors_df, interactions_df)
    item_train, item_test = _one_hot_items(item_train, item_test, args.n_items)

    print("Training model")
    classifier = model(user_train, item_train, y_train, user_test, item_test, y_test, args.epochs, args.batch_size)
    
    model_version = '1'
    classifier.save(os.path.join(args.sm_model_dir, model_version))
