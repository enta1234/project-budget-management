import dynamic from 'next/dynamic';
import Loading from './Loading';

export default function lazyLoad(loader) {
  return dynamic(loader, { loading: () => <Loading />, ssr: false });
}
