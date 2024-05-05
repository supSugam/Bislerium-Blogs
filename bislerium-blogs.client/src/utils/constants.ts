import axios from 'axios';

export const COLORS = {
  primary: '#242424',
  secondary: '#6B6B6B',
};

export const api = axios.create({
  baseURL: `https://localhost:7004/api`,
});

export const AVATAR_PLACEHOLDER =
  'https://c8.alamy.com/comp/2G7FT1F/default-avatar-photo-placeholder-grey-profile-picture-icon-woman-in-t-shirt-2G7FT1F.jpg';

export const keyFactory = {
  blogVotes: 'blog-votes',
  commentReactions: 'comments-reactions',
};
