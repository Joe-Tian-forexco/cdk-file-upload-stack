import { mockRequest, mockResponse } from "../__mocks__";
import { getUsersTest } from "../services/upload";

describe("getUsersTest", () => {
  it("should return a list of buckets", async () => {
    // test implementation
    await getUsersTest(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledWith(['dfdf']);
  });
});
