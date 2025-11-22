import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">🚀 Space Shooter</h1>
      <p className="text-lg mb-8">Defend the galaxy and collect points!</p>
      <div className="flex gap-6">
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
          onClick={() => navigate('/game')}
        >
          Start New Game
        </button>
        <button
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
          onClick={() => navigate('/game?resume=true')}
        >
          Resume
        </button>
      </div>
    </div>
  );
};

export default HomePage;
