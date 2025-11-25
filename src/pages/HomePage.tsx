import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden px-4">
      {/* Optional star background */}
      <div className="absolute inset-0 bg-[url('/stars.png')] bg-no-repeat bg-center bg-cover opacity-20"></div>

      <div className="z-10 flex flex-col items-center text-center">
        {/* Game Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-[0_0_12px_rgba(0,255,255,0.7)] animate-pulse">
          🚀 Space Shooter
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-md">
          Try to win if you can.
        </p>

        {/* Start Button */}
        <button
          className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 rounded-full text-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigate('/game')}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default HomePage;
