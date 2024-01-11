import { useNavigate } from 'react-router-dom';

import Kaput from '@/assets/kaput.png';
import { Button } from '@/components/ui/button';

export function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center text-primary">
      <img className="w-1/3" src={Kaput} alt="kaput" />
      <h1 className="kp-big-banner text-blue uppercase">Welcome on Kaput</h1>
      <Button onClick={() => navigate('dashboard')}>Let's go</Button>
    </div>
  );
}
