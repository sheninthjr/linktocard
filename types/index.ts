export interface YoutubeResponse {
  title: string;
  description: string;
  profile: string;
  url: string;
  imagePath: string;
  userName: string;
  userId: string;
  views: string;
}

export interface LinkedInResponse {
  authorName: string;
  authorBio: string;
  followers: string;
  description: string;
  authorImageUrl: string;
  imageUrl: string;
}

export interface GithubResponse {
  title: string;
  description: string;
  image: string;
  userName: string;
  prStatus: string;
  avatar: string;
}
