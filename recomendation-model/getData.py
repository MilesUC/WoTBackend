import pandas as pd
import numpy as np
import pymysql
from gensim.models import Word2Vec
from sklearn.preprocessing import MinMaxScaler
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

def build_dataframes():
    # Set pymysql
    db = pymysql.connect(host='wot-database.cvaeffy0qj7k.us-east-1.rds.amazonaws.com', user='wotAdmin', password='U35GebgcH7qD', db='develop')
    cursor = db.cursor()

    # Set users dataframe

    # Get column names
    cursor.execute("show columns from usuarias;")
    users_column_names = cursor.fetchall()
    users_column_names = [column[0] for column in users_column_names]

    # Get users data
    cursor.execute("SELECT * FROM usuarias;")
    output = cursor.fetchall()
    users_df = pd.DataFrame(output, columns=users_column_names)
    users_df = users_df.set_index('id')

    # Normalize data
    users_df.drop([
        'rut',
        'nombre',
        'apellido',
        'celular',
        'mail',
        'empresa_actual',
        'empresa_adicional',
        'id_cargo',
        'id_cargo_adicional',
        'id_anios_experiencia',
        'experienciaDirectorios',
        'altaDireccion',
        'redesSociales',
        'factor', # Podría ser relevante, pero se tiene muy poca data de este campo
        'nombrePuebloOriginario', # Podría ser relevante, pero se tiene muy poca data de este campo
        'id_region_con_compromiso',
        'region_domicilio',
        'id_posibilidad_cambiarse_region',
        'disposicion_viajar',
        'id_modalidad',
        'id_jornada',
        'id_conocio_wot',
        'id_rol',
        'declaracion',
        'id_pais_domicilio', # Podría ser útil si se hacen comunidades enfocadas en países, pero por mientras no se considerará
        'universidad', # Podría ser útil si se hacen comunidades enfocadas en universidades, pero por mientras no se considerará
        'created_at',
        'updated_at'
        ], axis=1, inplace=True)

    users_df.drop(users_df[users_df.intereses.isnull()].index, inplace=True) # Los intereses son lo más importante, por lo que las usuarias que no los tienen no son relevantes

    # Se obtienen los valores correspondientes a los ids
    cursor.execute("SELECT id, nombre_industria FROM industrias;")
    output = cursor.fetchall()
    industries_df = pd.DataFrame(output, columns=['id', 'nombre'])
    industries_df.set_index('id', inplace=True)

    cursor.execute("SELECT id, personalidad FROM formulario_personalidades;")
    output = cursor.fetchall()
    personalities_df = pd.DataFrame(output, columns=['id', 'personalidad'])
    personalities_df.set_index('id', inplace=True)

    # Se reemplazan los ids por los valores correspondientes
    users_df['id_industria_actual'].replace(industries_df['nombre'], inplace=True)
    users_df['id_industria_adicional'].replace(industries_df['nombre'], inplace=True)
    users_df['id_personalidad'].replace(personalities_df['personalidad'], inplace=True)

    # Se reemplazan nombres de columnas
    users_df.rename(columns={
        'id_industria_actual': 'industria_actual',
        'id_industria_adicional': 'industria_adicional',
        'id_personalidad': 'personalidad'
    }, inplace=True)

    # Se reemplazan valores nulos texto vacío según corresponda
    users_df['postgrado'].fillna("", inplace=True)
    users_df['brief'].fillna("", inplace=True)
    users_df['industria_actual'].fillna("", inplace=True)
    users_df['industria_adicional'].fillna("", inplace=True)
    users_df['personalidad'].fillna("", inplace=True)

    # Set communities dataframe

    # Get column names
    cursor.execute("show columns from Communities;")
    communities_column_names = cursor.fetchall()
    communities_column_names = [column[0] for column in communities_column_names]

    # Get communities data
    cursor.execute("SELECT * FROM Communities;")
    output = cursor.fetchall()
    communities_df = pd.DataFrame(output, columns=communities_column_names)
    communities_df = communities_df.set_index('id')

    # Normalize data
    communities_df.drop([
        'createdAt',
        'updatedAt'
        ], axis=1, inplace=True)

    communities_df

    # Get useful interaction data

    # Get users communities data
    cursor.execute("show columns from UsuariaCommunities;")
    users_communities_column_names = cursor.fetchall()
    users_communities_column_names = [column[0] for column in users_communities_column_names]

    cursor.execute("SELECT * FROM UsuariaCommunities;")
    output = cursor.fetchall()
    users_communities_df = pd.DataFrame(output, columns=users_communities_column_names)
    users_communities_df = users_communities_df.set_index('id')
    users_communities_df.drop([
        'createdAt',
        'updatedAt'
        ], axis=1, inplace=True)

    # Get posts data
    cursor.execute("show columns from Posts;")
    posts_column_names = cursor.fetchall()
    posts_column_names = [column[0] for column in posts_column_names]

    cursor.execute("SELECT * FROM Posts;")
    output = cursor.fetchall()
    posts_df = pd.DataFrame(output, columns=posts_column_names)
    posts_df = posts_df.set_index('id')
    posts_df.drop([
        'edited',
        'content',
        'createdAt',
        'updatedAt'
        ], axis=1, inplace=True)

    # Get users likes in communities data
    cursor.execute("SELECT PostLikes.id, PostLikes.usuariaId, Posts.communityId FROM PostLikes JOIN Posts ON PostLikes.postId = Posts.id;")
    output = cursor.fetchall()
    users_likes_df = pd.DataFrame(output, columns=['id', 'usuariaId', 'communityId'])
    users_likes_df = users_likes_df.set_index('id')

    # Close cursor and connection
    cursor.close()
    db.close()

    return users_df, communities_df, users_communities_df, posts_df, users_likes_df

# Calcular interacción de un usuario en una comunidad
def interaction(user_id, community_id, posts_df, users_likes_df):
    # 5 puntos si pertenece a la comunidad
    # Si se está ejecutando esta función, es porque la usuaria pertenece a la comunidad
    points = 5

    # 1 punto por cada like en la comunidad
    points += users_likes_df[(users_likes_df.usuariaId == user_id) & (users_likes_df.communityId == community_id)].shape[0]

    # 3 puntos por cada post en la comunidad
    points += posts_df[(posts_df.communityId == community_id) & (posts_df.userId == user_id)].shape[0] * 3

    return points

def build_interactions_df(communities_df, users_df, users_communities_df, posts_df, users_likes_df):
    # Set interactions dataframe

    # Use communities ids as column names
    interactions_df = pd.DataFrame(columns=communities_df.index)
    interactions_df.index.name = 'userId'

    for user_id in users_df.index:
        for community_id in users_communities_df[users_communities_df['userId'] == user_id]['communityId']:
            interactions_df.loc[user_id, community_id] = interaction(user_id, community_id, posts_df, users_likes_df)

    # Reemplazar valores nulos por 0
    interactions_df.fillna(0, inplace=True)

    # Normalizar los valores
    scaler = MinMaxScaler()
    interactions_df = pd.DataFrame(scaler.fit_transform(interactions_df.T).T, columns=interactions_df.columns, index=interactions_df.index)
    
    return interactions_df

# Función para preprocesar el texto
def preprocess_text(text):
    # Convertir a minúsculas
    text = text.lower()

    # Tokenizar el texto
    tokens = word_tokenize(text)

    # Eliminar palabras vacías (stop words)
    tokens = [word for word in tokens if word not in stopwords.words('spanish')]  # Asumiendo que el texto está en español

    # Lemmatización
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    # Volver a unir el texto
    return ' '.join(tokens)

def users_embedding(users_df, interactions_df):
    # Descargar recursos de NLTK necesarios
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

    # Se junta todo el texto en una sola columna
    users_df['text'] = users_df['postgrado'] + ' ' + users_df['industria_actual'] + ' ' + users_df['industria_adicional'] + ' ' + users_df['intereses'] + ' ' + users_df['brief'] + ' ' + users_df['personalidad']
    users_df.drop(['postgrado', 'industria_actual', 'industria_adicional', 'intereses', 'brief', 'personalidad'], axis=1, inplace=True)

    # Aplicar la función de preprocesamiento
    users_df['text'] = users_df['text'].apply(preprocess_text)

    # Tokenizar el texto
    users_df['tokenized'] = users_df['text'].apply(word_tokenize)

    # Entrenar un modelo Word2Vec
    model = Word2Vec(sentences=users_df['tokenized'], vector_size=100, window=5, min_count=1, workers=4)

    # O convertir todo el texto en un vector (puedes promediar los vectores de todas las palabras en el texto)
    def document_vector(doc):
        return np.mean([model.wv[word] for word in doc if word in model.wv], axis=0)

    users_df['vector'] = users_df['tokenized'].apply(document_vector)

    # Representar el vector como un dataframe
    users_vectors_df = pd.DataFrame(users_df['vector'].to_list(), index=users_df.index)

    # Normalizar los vectores
    scaler = MinMaxScaler()
    users_vectors_df = pd.DataFrame(scaler.fit_transform(users_vectors_df.T).T, columns=users_vectors_df.columns, index=users_vectors_df.index)
    # Considerar solo las usuarias que tienen interacciones
    users_vectors_df = users_vectors_df[users_vectors_df.index.isin(interactions_df.index)]

    return users_vectors_df

def save_data(users_vectors_df, interactions_df):
    # Guardar los dataframes en archivos .csv en la carpeta data
    users_vectors_df.to_csv('data/users_vectors.csv')
    interactions_df.to_csv('data/interactions.csv')

if __name__ == '__main__':
    users_df, communities_df, users_communities_df, posts_df, users_likes_df = build_dataframes()
    interactions_df = build_interactions_df(communities_df, users_df, users_communities_df, posts_df, users_likes_df)
    users_vectors_df = users_embedding(users_df, interactions_df)
    save_data(users_vectors_df, interactions_df)