import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  "id":            { type: Number, unique: true },
  "from_id":       Number,
  "owner_id":      Number,
  "date":          Number,
  "marked_as_ads": Number,
  "post_type":     String,
  "text":          String,
  "is_pinned":     Number,
  "attachments":   [{
    "type":  { type: String },
    "photo": {
      "album_id":   Number,
      "date":       Number,
      "id":         Number,
      "owner_id":   Number,
      "has_tags":   Boolean,
      "access_key": String,
      "sizes":      [{
        "height": Number,
        "url":    String,
        "type":   { type: String },
        "width":  Number
      }],
      "text":       String,
      "user_id":    Number,
    },
    "link":  {
      "url":         String,
      "title":       String,
      "description": String,
      "target":      String,
      "photo":       {
        "album_id": Number,
        "date":     Number,
        "id":       Number,
        "owner_id": Number,
        "has_tags": Boolean,
        "sizes":    [{
          "height": Number,
          "url":    String,
          "type":   { type: String },
          "width":  Number
        }],
        "text":     String
      }
    }
  }],
  "post_source":   { "type": { type: String } },
  "comments":      { "count": Number, "can_post": Number, "groups_can_post": Boolean },
  "likes":         { "count": Number, "user_likes": Number, "can_like": Number, "can_publish": Number },
  "reposts":       { "count": Number, "user_reposted": Number },
  "views":         { "count": Number },
  "edited":        Number,

  "label":   String,
  "geoData": [{
    "geo":        { "latitude": Number, "longitude": Number },
    "value":      String,
    "shortValue": String,
  }]
}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);

export default Post;
