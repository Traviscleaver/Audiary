const request = require("supertest");
const app = require("../server/app");
const { pool } = require("../server/db");


let token;

describe("USER ENDPOINT TESTS", () => {
  
  // LOGIN FIRST
  test("Login TEST user and return JWT", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "TEST@gmail.com",
        password: "TESTPASS"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  // GET /profile (self)
  test("GET /profile (self)", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("TEST");
  });

  // GET public profile
  test("GET /users/TEST/profile", async () => {
    const res = await request(app).get("/users/TEST/profile");
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("TEST");
  });

  // GET ratings
  test("GET /users/TEST/ratings", async () => {
    const res = await request(app).get("/users/TEST/ratings");
    expect(res.statusCode).toBe(200);
    expect(res.body.ratings.length).toBeGreaterThan(0);
  });

  // GET reviews
  test("GET /users/TEST/reviews", async () => {
    const res = await request(app).get("/users/TEST/reviews");
    expect(res.statusCode).toBe(200);
    expect(res.body.reviews.length).toBeGreaterThan(0);
  });

  // GET playlists
  test("GET /users/TEST/playlists", async () => {
    const res = await request(app).get("/users/TEST/playlists");
    expect(res.statusCode).toBe(200);
    expect(res.body.playlists.length).toBeGreaterThan(0);
  });

  // GET diary
  test("GET /users/TEST/diary", async () => {
    const res = await request(app).get("/users/TEST/diary");
    expect(res.statusCode).toBe(200);
    expect(res.body.diary.length).toBeGreaterThan(0);
  });

  // GET favorites
  test("GET /users/TEST/favorites", async () => {
    const res = await request(app).get("/users/TEST/favorites");
    expect(res.statusCode).toBe(200);
    expect(res.body.favorites.length).toBeGreaterThan(0);
  });

  // GET activity
  test("GET /users/TEST/activity", async () => {
    const res = await request(app).get("/users/TEST/activity");
    expect(res.statusCode).toBe(200);
    expect(res.body.activity.length).toBeGreaterThan(0);
  });

  // GET stats
  test("GET /users/TEST/stats", async () => {
    const res = await request(app).get("/users/TEST/stats");
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.stats).toBe("object");
  });

  // GET full profile
  test("GET /users/TEST/full", async () => {
    const res = await request(app).get("/users/TEST/full");
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("TEST");
  });

});

afterAll(async () => {
  await pool.end();
});
