export interface Rocket {
  id: string;
  name: string;
  company: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  isLocal?: boolean;
}
