/**
 * @class Message
 */

class Message {
  constructor(message, sender, videoId = null) {
    this.message = message;
    this.sender = sender;
    this.videoId = videoId;
  }
}

export default Message;
