const { postLogin } = require("../controllers/authControllers");
const { User } = require("../db/userModel");
let jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

describe("Controller should return status 200, token, user", () => {
  it("testing", async () => {
    const body = { email: "Oleg@new.com", password: "123123" };
    const login = {
      _id: "63be9523aeb53ff7d8f81f77",
      password: "$2b$10$FVtPvBVY8KzH.aQzpd68wepPKB6I1mEIL3ON/OaOJjKNNKUI7iPfW",
      email: "Oleg@new.com",
      subscription: "starter",
      __v: 0,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2JlOTUyM2FlYjUzZmY3ZDhmODFmNzciLCJpYXQiOjE2NzM2MzM3NjB9.7wMOIdIagZ62j_W7O4vNhibrO94ChFWTmwJq9PWhJ54",
    };

    const user = {
      _id: "63c05f935787743a1de51707",
      password: "$2b$10$FVtPvBVY8KzH.aQzpd68wepPKB6I1mEIL3ON/OaOJjKNNKUI7iPfW",
      email: "Oleg@new.com",
      subscription: "starter",
      avatarURL: "/avatars/59e900bc-496f-4fe7-a113-09168b4d92e3.jpg",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2JlOTUyM2FlYjUzZmY3ZDhmODFmNzciLCJpYXQiOjE2NzM2MzM3NjB9.7wMOIdIagZ62j_W7O4vNhibrO94ChFWTmwJq9PWhJ54",
    };
    const { token } = user;
    jwt.sign.mockResolvedValue(token);
    
    const mReq = () => {
      const req = { body };
      req.params = jest.fn().mockReturnValue(req);
      return req;
    };
    const mRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const req = mReq();
    const res = mRes();
    const mNext = jest.fn();

    jest.spyOn(User, "findOne").mockImplementationOnce(() => login);
    jest.spyOn(User, "findOneAndUpdate").mockImplementationOnce(() => user);
    await postLogin(req, res, mNext);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token,
        user: {
          email: expect.any(String),
          subscription: expect.any(String),
        },
      })
    );
  });
});
