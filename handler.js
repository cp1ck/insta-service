const fetch = require('node-fetch');
'use strict';

const token = "IGAAhwy6iWpZC5BZAFB5enBQTnliMWNIZAjJDbU1GMUhmUGxRa3RaVE5IaFBLbENIaWxWWk1xT3lUZAVdfVkl0Q2ZA2bDA1eFVNZA1ZABV1FMVjd2QTJZAVHgwX3VqT196c1Y4Vmt4amE3bUNYdk85NkVZAOFRhTjBmY0xjZAHV0b3ZAsd19JUQZDZD";
const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;

module.exports.refreshToken = async (event) => {
  const response = await fetch(url);
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(
      data
    )
  };
};

module.exports.getFeed = async (event) => {
  const feed = await fetch(`https://graph.instagram.com/me/media?access_token=${token}&fields=media_url,media_type,caption,permalink,children{id,media_url, media_type, permalink}`);
  const json = await feed.json();
  const { data } = json;
  const nicePost = (media) => {
    const post = {
      // caption: media.edge_media_to_caption.edge[0].text,
      src: media.media_url,
      id: media.id,
      isVideo: media.media_type === 'VIDEO',
      permalink: media.permalink
    };
    return post;
  };

  const posts = data.map((item) => {
    if (item.media_type === 'CAROUSEL_ALBUM') {
      return item.children.data
        .map(element => nicePost(element));
    }
    return [nicePost(item)];
  });
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
      posts
    )
  };
};
