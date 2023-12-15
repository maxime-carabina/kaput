import Kaput from '@/assets/kaput.png';

export function Index() {
  return (
    <div className="flex flex-col justify-center items-center text-f-primary">
      <img src={Kaput} alt="kaput" />
      <h1 className="kp-big-banner text-blue uppercase">Welcome on Kaput</h1>
    </div>
  );
}
