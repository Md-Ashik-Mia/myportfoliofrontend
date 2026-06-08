import { FiBarChart2, FiCheckCircle, FiDollarSign, FiStar } from 'react-icons/fi';

const pricing = [
  { tier: 'Starter', price: '$300', note: 'Landing pages and small fixes' },
  { tier: 'Growth', price: '$800', note: 'Multi-section sites and dashboards' },
  { tier: 'Premium', price: '$1500', note: 'Full product builds and custom motion' },
];

export default function SalaryPricingPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f62ff]">
            <FiDollarSign />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Pricing</div>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Salary & package guide</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {pricing.map((item) => (
            <article key={item.tier} className="rounded-[26px] border border-white/10 bg-[#090f20] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{item.tier}</h3>
                  <p className="mt-2 text-sm text-white/50">{item.note}</p>
                </div>
                <div className="text-3xl font-black tracking-[-0.06em] text-[#7fb0ff]">{item.price}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-4xl border border-white/10 bg-linear-to-br from-[#0d1632] to-[#090e1c] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="flex items-center gap-3 text-white/70">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f62ff]">
              <FiBarChart2 />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/35">Revenue view</div>
              <div className="font-semibold">Dummy projections</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
              <div className="text-sm text-white/45">Monthly</div>
              <div className="mt-2 text-2xl font-black">$4.2k</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
              <div className="text-sm text-white/45">Quarter</div>
              <div className="mt-2 text-2xl font-black">$12.8k</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
              <div className="text-sm text-white/45">Year</div>
              <div className="mt-2 text-2xl font-black">$48k</div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <FiStar />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/35">Notes</div>
              <div className="font-semibold">Current reference</div>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-white/60">
            <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-300" /> Use this page to compare project budget tiers.</li>
            <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-300" /> Later we can connect real salary, invoice, or pricing data.</li>
            <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-300" /> You can add more admin pages when needed.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}