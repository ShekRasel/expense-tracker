import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Wallet,
  ChartPie,
  Target,
  Sparkles,
} from "lucide-react";
import DashboardPreview from "@/components/public/dashboard-preview";
export default function Home() {
  return (
    <>
      <section className="hero site-container">
        <div className="hero-copy">
          <span className="pill">
            <span className="status-dot" /> A fresh perspective on your finances
          </span>
          <h1>
            Less money stress.
            <br />
            More <span>life.</span>
          </h1>
          <p>
            Your everyday expenses, your bigger goals, and everything in
            between. Give your money a little direction.
          </p>
          <div className="actions">
            <Link href="/sign-up" className="btn btn-primary btn-large">
              Take control of your money <ArrowUpRight size={19} />
            </Link>
            <Link href="/guest" className="text-link">
              Try the planner <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-checks">
            <span>
              <Check size={15} /> Simple to get started
            </span>
            <span>
              <Check size={15} /> Made for everyday life
            </span>
          </div>
        </div>
        <DashboardPreview />
      </section>
      <section className="benefit-strip">
        <div className="site-container">
          <p>
            A little intention.
            <br />
            <strong>A healthier money routine.</strong>
          </p>
          <span>
            <Wallet /> Know where it goes
          </span>
          <span>
            <Target /> Spend with a plan
          </span>
          <span>
            <ChartPie /> See the bigger picture
          </span>
        </div>
      </section>
      <section id="features" className="section site-container">
        <div className="section-intro">
          <p className="eyebrow">LESS GUESSWORK. MORE CLARITY.</p>
          <h2>
            Everything you need.
            <br />
            Room to breathe included.
          </h2>
          <p>
            Simple tools that help you feel good about your next financial
            decision.
          </p>
        </div>
        <div className="feature-grid">
          {[
            [
              Wallet,
              "A home for every expense",
              "From your morning coffee to your monthly rent, keep your spending organized in categories.",
              "01",
            ],
            [
              Target,
              "Plans that keep you grounded",
              "Set a spending goal and know exactly how much room is left in your budget.",
              "02",
            ],
            [
              ChartPie,
              "Your money, made visible",
              "Clear charts and downloadable reports turn everyday numbers into useful perspective.",
              "03",
            ],
          ].map(([Icon, title, copy, n]) => (
            <article className="feature-card" key={title}>
              <div className="section-heading">
                <span className="icon-tile">
                  <Icon size={25} />
                </span>
                <span className="feature-number">{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="how-it-works" className="how-section site-container">
        <div>
          <p className="eyebrow">A FRESH START, IN THREE STEPS</p>
          <h2>
            Better habits.
            <br />
            One day at a time.
          </h2>
          <p className="muted">
            You don’t need a complicated spreadsheet.
            <br />
            Just a plan you can come back to.
          </p>
          <Link href="/sign-up" className="text-link">
            Let’s get you started <ArrowRight size={17} />
          </Link>
        </div>
        <div className="steps">
          {[
            [
              "Make yourself at home",
              "Create your account and give your finances a place to live.",
            ],
            [
              "Put your plan on paper",
              "Set a budget and add your expense categories.",
            ],
            [
              "Find your rhythm",
              "Check in, adjust your spending, and keep moving forward.",
            ],
          ].map(([title, copy], index) => (
            <div className="step" key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="site-container">
        <div className="cta">
          <Sparkles size={28} />
          <h2>Make room for what matters.</h2>
          <p>Your next chapter starts with a little clarity.</p>
          <Link href="/sign-up" className="btn btn-light">
            Start your journey <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
