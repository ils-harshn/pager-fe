import config from "../config";
import { API_ENDPOINTS } from "../constants";

class RoomService {
  async getConnectedUsers(roomId) {
    try {
      const response = await fetch(
        `${config.uri}${API_ENDPOINTS.GET_CONNECTED_USERS}?roomId=${encodeURIComponent(roomId)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch connected users:", error);
      throw error;
    }
  }
}

export default new RoomService();
