// @ts-nocheck
import LoginView from '../components/LoginView';
import { useLoginPresenter } from '../presenters/loginPresenter';

export default function Home() {
  const presenter = useLoginPresenter();
  return <LoginView {...presenter} />;
}
