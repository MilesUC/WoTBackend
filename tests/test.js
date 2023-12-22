const supertest = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/utils/getSequelizeConnection");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const Usuaria = require("../src/models/Usuaria");
const Community = require("../src/models/community");

const { adminDeleteUser } = require("../src/utils/cognitoUtils");

dotenv.config();

const request = supertest(app);

// Variables y constantes globales
// const saltRounds = 10;
// let hashedPassword;
let token;
let id;
const expirationSeconds = 1 * 60 * 60 * 24; // Dura 24 horas, se puede escalar
const JWT_PRIVATE_KEY = "secret";

async function deleteCognitoUsers() {
  const users = await Usuaria.findAll();
  users.map(async (user) => {
    await adminDeleteUser(user.mail);
  });
}

beforeAll(async () => {
  try {
    var options = { raw: true };
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", null, options);
    await Usuaria.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Community.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", null, options);
    await sequelize.authenticate();

    // hashedPassword = await bcrypt.hash("test123", saltRounds);

    const res = await request.post("/auth/signup").send({
      name: "nameTest",
      lastName: "lastNameTest",
      mail: "usertest@test.com",
      password: "Test1234_",
    });

    token = await res.body.access_token;
    id = await res.body.id;
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await deleteCognitoUsers();
  await sequelize.close();
});

describe("POST /auth/signup", () => {
  it("should create a new user", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "newusertest13@test.com",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("access_token");
  });

  it("should not create a new user (too short password)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "test2@test.com",
      password: "tst",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual([
      "Password requires at least 4 characters.",
    ]);
  });

  it("should not create a new user (email in use)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "usertest@test.com",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("An account with the given email already exists.");
  });

  it("should not create a new user (not an email address)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "test",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Email address is not valid."]);
  });

  it("should not create a new user (not an email address)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "test@",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Email address is not valid."]);
  });

  it("should not create a new user (not an email address)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "test@js",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Email address is not valid."]);
  });

  it("should not create a new user (not an email address)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "test@js.",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Email address is not valid."]);
  });

  it("should not create a new user (missing fields)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "",
      lastName: "Test",
      mail: "test@js.com",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Name can't be empty."]);
  });

  it("should not create a new user (missing fields)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "",
      mail: "test@js.com",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Last name can't be empty."]);
  });

  it("should not create a new user (missing fields)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Email can't be empty."]);
  });

  it("should not create a new user (missing fields)", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "test@js.com",
      password: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Password can't be empty."]);
  });
});

describe("POST /auth/login", () => {
  it("should login a user", async () => {
    const res = await request.post("/auth/login").send({
      mail: "usertest@test.com",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("access_token");
  });

  it("should not login a user (wrong email)", async () => {
    const res = await request.post("/auth/login").send({
      mail: "notexistingtest@test.com",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("Email address not found.");
  });

  it("should not login a user (wrong password)", async () => {
    const res = await request.post("/auth/login").send({
      mail: "usertest@test.com",
      password: "test1234",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Incorrect password.");
  });

  it("should not login a user (missing fields)", async () => {
    const res = await request.post("/auth/login").send({
      mail: "",
      password: "Test1234_",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Email can't be empty."]);
  });

  it("should not login a user (missing fields)", async () => {
    const res = await request.post("/auth/login").send({
      mail: "usertest@test.com",
      password: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Password can't be empty."]);
  });
});

// Comunidades
describe("POST /communities/create", () => {
  it("should create a new community", async () => {
    const res = await request
      .post("/communities/create")
      .send({
        name: "Test",
        description: "Test",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("community");
  });

  it("should not create a new community (token not valid)", async () => {
    const id = -1;
    nonExistentToken = jwt.sign(
      { scope: ["user"] },
      JWT_PRIVATE_KEY,
      { subject: id.toString() },
      { expiresIn: expirationSeconds }
    );

    const res = await request.post("/communities/create").send({
      name: "Test",
      description: "Test",
    }).set("Authorization", `Bearer ${nonExistentToken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual("Token not valid!");
  });

  it("should not create a new community (missing fields)", async () => {
    const res = await request
      .post("/communities/create")
      .send({
        description: "Test",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Name is required."]);
  });

  it("should not create a new community (missing fields)", async () => {
    const res = await request
      .post("/communities/create")
      .send({
        name: "Test",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Description is required."]);
  });
});

describe("POST /communities/join", () => {
  it("user should join a community", async () => {
    // Se crea un nuevo usuario
    const user2 = await request.post("/auth/signup").send({
      name: "nameTest2",
      lastName: "lastNameTest2",
      mail: "existingtest2@test.com",
      password: "Test1234_",
    });

    // Se crea una comunidad
    const createRes = await request
      .post("/communities/create")
      .send({
        name: "communityNameTest",
        description: "communityDescriptionTest",
      })
      .set("Authorization", `Bearer ${token}`);

    const res = await request
      .post("/communities/join")
      .send({
        communityId: createRes.body.community.id,
      })
      .set("Authorization", `Bearer ${user2.body.access_token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("userCommunity");

  });

  it("user should not join a community (already belongs)", async () => {
    // Se crea una comunidad
    const createRes = await request
      .post("/communities/create")
      .send({
        name: "communityNameTest",
        description: "communityDescriptionTest",
      })
      .set("Authorization", `Bearer ${token}`);

    const res = await request
      .post("/communities/join")
      .send({
        communityId: createRes.body.community.id,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("User already belongs to the community.");
  });

  it("should not join (user not found)", async () => {
    const id = -1;
    nonExistentToken = jwt.sign(
      { scope: ["user"] },
      JWT_PRIVATE_KEY,
      { subject: id.toString() },
      { expiresIn: expirationSeconds }
    );
    
    // Se crea una comunidad
    const createRes = await request
      .post("/communities/create")
      .send({
        name: "communityNameTest",
        description: "communityDescriptionTest",
      })
      .set("Authorization", `Bearer ${token}`);

    const res = await request.post("/communities/join").send({
      communityId: createRes.body.community.id,
    }).set("Authorization", `Bearer ${nonExistentToken}`);
    expect(res.body.error).toEqual("Token not valid!");
    expect(res.statusCode).toEqual(401);
  });

  it("should not join a community (missing fields)", async () => {
    // Se crea un nuevo usuario
    const user2 = await Usuaria.create({
      name: "nameTest2",
      lastName: "lastNameTest2",
      rut: "36592759-5",
      mail: "existingtest2@test.com",
      password: "test2",
    });

    // Se crea una comunidad
    const community = await Community.create({
      name: "communityNameTest",
      description: "communityDescriptionTest",
      ownerId: id,
    });

    const res = await request
      .post("/communities/join")
      .send({})
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(["Community ID is required."]);
  });
});

describe("GET /communities/memberships", () => {
  it("should get all communities user takes part in", async () => {
    const res = await request
      .get("/communities/memberships")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("ownCommunities");
    expect(res.body).toHaveProperty("otherCommunities");
  });
});

describe("GET /communities/joinable_communities", () => {
  it("should get all communities user can take part in", async () => {
    const res = await request
      .get("/communities/joinable_communities")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("GET /communities/:communityId", () => {
  it("should fail on non existent community", async () => {
    const res = await request
      .get(`/communities/10000`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("Community not found");
  });
});

describe("DELETE /communities/:communityId", () => {
  it("should fail on non existent community", async () => {
    const res = await request
      .delete(`/communities/10000`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("Community not found.");
  });
});

// GET USERS
describe("GET /users", () => {
  it("should get all users", async () => {
    const res = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("GET /users/get_profile", () => {
  it ("should get user profile", async () => {
    const res = await request
      .get("/users/get_profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it ("should fail on non existent user", async () => {
    const id = 10000;
    nonExistentToken = jwt.sign(
      { scope: ["user"] },
      JWT_PRIVATE_KEY,
      { subject: id.toString() },
      { expiresIn: expirationSeconds }
    );

    const res = await request
      .get("/users/get_profile")
      .set("Authorization", `Bearer ${nonExistentToken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual("Token not valid!");
  });
});

describe("GET /users/:userId", () => {
  it("should get a single user", async () => {
    const res = await request
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it("should not get a single user", async () => {
    const res = await request
      .get("/users/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("User not found.");
  });

  it("should get a new single user", async () => {
    const resSignUp = await request.post("/auth/signup").send({
      name: "nameTest",
      lastName: "lastNameTest",
      mail: "newidtest@test.com",
      password: "Test1234_",
    });

    const res = await request
      .get(`/users/${resSignUp.body.id}`)
      .set("Authorization", `Bearer ${resSignUp.body.access_token}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("DELETE /users/delete_account", () => {
  it("should delete an existing user", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "deletetest@test.com",
      password: "Test1234_",
    });

    const resDelete = await request
      .delete(`/users/delete_account`)
      .set("Authorization", `Bearer ${res.body.access_token}`);
    expect(resDelete.statusCode).toEqual(200);
  });

  it("should return error on non existent user", async () => {
    const res = await request.post("/auth/signup").send({
      name: "Test",
      lastName: "Test",
      mail: "deletetest2@test.com",
      password: "Test1234_",
    });
    const resDelete1 = await request
      .delete(`/users/delete_account`)
      .set("Authorization", `Bearer ${res.body.access_token}`);
    const resDelete2 = await request
      .delete(`/users/delete_account`)
      .set("Authorization", `Bearer ${res.body.access_token}`);
    expect(resDelete2.statusCode).toEqual(404);
    expect(resDelete2.body.error).toEqual("User not found.");
  });
});

describe("POST /users/change_password", () => {
  const id = 100000;
  newToken = jwt.sign(
    { scope: ["user"] },
    JWT_PRIVATE_KEY,
    { subject: id.toString() },
    { expiresIn: expirationSeconds }
  );
  it("should fail on non-existent user", async () => {
    const res = await request
      .post(`/users/change_password`)
      .send({
        oldPassword: "test123",
        newPassword: "test1234",
      })
      .set("Authorization", `Bearer ${newToken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual("Token not valid!");
  });

  it("should fail with missing fields (newPassword)", async () => {
    const res = await request
      .post(`/users/change_password`)
      .send({
        oldPassword: "Test1234_",
        newPassword: "",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
  });

  it("should fail with missing fields (oldPassword)", async () => {
    const res = await request
      .post(`/users/change_password`)
      .send({
        oldPassword: "",
        newPassword: "Test12345_",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
  });

  it("should fail with invalid old password", async () => {
    const res = await request
      .post(`/users/change_password`)
      .send({
        oldPassword: "badpasswordprompt",
        newPassword: "test1234",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Incorrect current password.");
  });

  it("should fail with new password that is too short", async () => {
    const res = await request
      .post(`/users/change_password`)
      .send({
        oldPassword: "Test1234_",
        newPassword: "pas",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual([
      "Password requires at least 4 characters.",
    ]);
  });

  it("should change user's password", async () => {
    const res = await request
      .post(`/users/change_password`)
      .send({
        oldPassword: "Test1234_",
        newPassword: "Test12345_",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("PATCH /users/edit_profile", () => {
  it("should update profile attributes", async () => {
    const updateRes = await request
      .patch(`/users/edit_profile`)
      .send({
        celular: "+56912345678",
        idiomas: ["1", "2", "3"],
      })
      .set("Authorization", `Bearer ${token}`);
    expect(updateRes.statusCode).toEqual(200);
  });
});
