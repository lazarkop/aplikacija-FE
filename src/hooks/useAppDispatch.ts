import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux-toolkit/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
