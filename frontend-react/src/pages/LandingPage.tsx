import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Lock,
  CreditCard,
  Headphones,
  Gift,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface GameCard {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Counter animation component
const CountUpNumber: React.FC<{ value: string }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const numericValue = parseInt(value);
        if (isNaN(numericValue)) {
          setDisplayValue(value);
          return;
        }
        let currentValue = 0;
        const increment = Math.ceil(numericValue / 30);
        const interval = setInterval(() => {
          currentValue += increment;
          if (currentValue >= numericValue) {
            setDisplayValue(value);
            clearInterval(interval);
          } else {
            setDisplayValue(currentValue.toString());
          }
        }, 30);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref}>{displayValue}</div>;
};

const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => (
  <div className="scroll-reveal bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 rounded-2xl p-8 text-center hover:border-amber-500/50 transition-all duration-300 group">
    <div className="flex justify-center mb-4 text-amber-400 group-hover:text-amber-300 transition-colors">
      {stat.icon}
    </div>
    <div className="text-4xl font-bold text-amber-400 mb-2">
      <CountUpNumber value={stat.value} />
    </div>
    <div className="text-slate-300 text-sm">{stat.label}</div>
  </div>
);

const GameCardComponent: React.FC<{ game: GameCard; index: number }> = ({
  game,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={game.link}>
      <div
        className="scroll-reveal group cursor-pointer rounded-xl overflow-hidden border border-amber-500/30 hover:border-amber-400 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${isHovered ? 'from-black/80' : 'from-black/60'}`} />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center animate-scale-in">
                <ArrowRight className="text-black" size={24} />
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-slate-900/50 backdrop-blur-sm border-t border-amber-500/20">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
            {game.title}
          </h3>
          <p className="text-slate-300 text-sm mb-4">{game.description}</p>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-3 transition-all">
            Play Now <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeatureCardComponent: React.FC<{ feature: FeatureCard }> = ({
  feature,
}) => (
  <div className="scroll-reveal bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center mb-4 text-white">
      {feature.icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
    <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
  </div>
);

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats: StatItem[] = [
    {
      value: '500K+',
      label: 'Active Players',
      icon: <Users size={24} />,
    },
    {
      value: '50+',
      label: 'Games Available',
      icon: <Star size={24} />,
    },
    {
      value: '$100M+',
      label: 'Prizes Distributed',
      icon: <TrendingUp size={24} />,
    },
    {
      value: '4.9★',
      label: 'Player Rating',
      icon: <Star size={24} />,
    },
  ];

  const games: GameCard[] = [
    {
      id: 'slots',
      title: 'Slots',
      description: 'Experience thrilling slot machines with massive jackpots',
      image: '/slots-game.jpg',
      link: '/slots',
    },
    {
      id: 'lottery',
      title: 'Lottery',
      description: 'Life-changing lottery draws with incredible prizes',
      image: '/lottery-game.jpg',
      link: '/lotteries',
    },
    {
      id: 'games',
      title: 'More Games',
      description: 'Explore our collection of exciting casino games',
      image: '/hero-casino.jpg',
      link: '/games',
    },
  ];

  const features: FeatureCard[] = [
    {
      icon: <Lock size={20} />,
      title: 'Secure & Fair',
      description:
        'Certified fair gaming with advanced encryption and regular audits',
    },
    {
      icon: <Zap size={20} />,
      title: 'Instant Payouts',
      description:
        'Quick and hassle-free withdrawals directly to your account',
    },
    {
      icon: <Shield size={20} />,
      title: 'Licensed & Regulated',
      description:
        'Fully licensed and regulated by international gaming authorities',
    },
    {
      icon: <Headphones size={20} />,
      title: '24/7 Support',
      description:
        'Expert customer support team available round the clock',
    },
    {
      icon: <Gift size={20} />,
      title: 'Exclusive Bonuses',
      description:
        'Welcome bonus, daily rewards, and exclusive promotions',
    },
    {
      icon: <CreditCard size={20} />,
      title: 'Multiple Payments',
      description:
        'All major payment methods supported for your convenience',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          {/* Hero content */}
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-block mb-6">
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <p className="text-amber-400 font-semibold text-sm">
                    🎰 Join the Revolution in Gaming
                  </p>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Experience the
                <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
                  {' '}
                  Ultimate Gaming
                </span>{' '}
                Platform
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                Join 500K+ players enjoying the most exciting slots, lottery
                draws, and casino games. Secure, fair, and rewarding.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/signup">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold rounded-lg flex items-center justify-center gap-2">
                    Sign Up Free
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/lotteries">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-purple-500/50 font-bold rounded-lg">
                    Explore Games
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-amber-400" />
                  Secure & Licensed
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-purple-400" />
                  Instant Payouts
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-amber-400" />
                  500K+ Players
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative animate-float-up">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-purple-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img
                src="/hero-casino.jpg"
                alt="Casino Gaming"
                className="relative w-full rounded-2xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Game Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Games
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-4">
              Choose from our exciting collection of games designed for every
              player
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <GameCardComponent key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              We provide the safest and most rewarding gaming experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
                <FeatureCardComponent feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              By The Numbers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Join millions of satisfied players worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
                <StatCard stat={stat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-900/30 to-purple-900/30 border border-amber-500/30 p-12 md:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center max-w-2xl mx-auto px-4">
              <div className="inline-block mb-6 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full">
                <p className="text-amber-400 font-semibold text-xs sm:text-sm">
                  Limited Time Offer
                </p>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Claim Your Welcome Bonus
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8">
                New players get up to 100% match bonus on first deposit plus 50
                free spins!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold rounded-lg">
                    Claim Bonus Now
                  </Button>
                </Link>
                <Link to="/promos">
                  <Button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold rounded-lg">
                    View All Promotions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Players Worldwide
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of satisfied players who are winning big
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Verified Player',
                testimonial:
                  'Amazing platform! Won $2,500 on slots last month. The withdrawals are super fast and reliable.',
                rating: 5,
              },
              {
                name: 'Maria Garcia',
                role: 'Verified Player',
                testimonial:
                  'Best gaming experience I\'ve had. The variety of games is incredible and customer support is always helpful.',
                rating: 5,
              },
              {
                name: 'James Chen',
                role: 'Verified Player',
                testimonial:
                  'Been playing for 6 months now. Fair games, great bonuses, and I\'ve made some serious wins!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="scroll-reveal bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  "{testimonial.testimonial}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-500" />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Winning?
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto px-4">
            Join thousands of players today and experience the thrill of
            premium gaming
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-lg rounded-lg flex items-center justify-center gap-2">
                Sign Up Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-lg rounded-lg">
                Login
              </Button>
            </Link>
          </div>

          <p className="text-sm text-slate-400 mt-8">
            18+ only. Gamble responsibly.{' '}
            <Link to="/responsible-gaming" className="text-amber-400 hover:underline">
              Learn more
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
