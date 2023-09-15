import React from 'react';
import { giphyService } from '../api/giphy/giphy.service';
import { IGifObject } from '../../components/giphy/Giphy';

export class GiphyUtils {
  static async getTrendingGifs(
    setGifs: React.Dispatch<React.SetStateAction<IGifObject[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setLoading(true);
    try {
      const response = await giphyService.trending();
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  static async searchGifs(
    gif: string,
    setGifs: React.Dispatch<React.SetStateAction<IGifObject[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (gif.length <= 1) {
      GiphyUtils.getTrendingGifs(setGifs, setLoading);
      return;
    }
    setLoading(true);
    try {
      const response = await giphyService.search(gif);
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
}
