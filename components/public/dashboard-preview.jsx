import {
  ArrowUpRight,
  ShoppingBag,
  Coffee,
  House,
  ChartNoAxesCombined,
  Wallet,
  LayoutDashboard,
  CircleCheck,
} from "lucide-react";
export default function DashboardPreview() {
  return (
    <div className="preview-wrap">
      <div className="preview-window">
        <div className="preview-top">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>YOUR MONEY, AT A GLANCE</span>
          <span className="preview-tag">Preview</span>
        </div>
        <div className="preview-content">
          <aside className="preview-sidebar">
            <ChartNoAxesCombined size={25} />
            <LayoutDashboard size={19} />
            <Wallet size={19} />
            <ShoppingBag size={19} />
          </aside>
          <div className="preview-main">
            <div className="section-heading">
              <div>
                <p className="mini-label">YOUR PERSONAL OVERVIEW</p>
                <h3>Good things start with a plan.</h3>
              </div>
              <span className="avatar">A</span>
            </div>
            <div className="preview-stats">
              <div className="preview-balance">
                <span>Remaining budget</span>
                <strong>
                  ৳ 18,450<span>.00</span>
                </strong>
                <small>
                  <CircleCheck size={12} /> You’re within your budget
                </small>
              </div>
              <div className="preview-small">
                <span>Total spent</span>
                <strong>৳ 11,550</strong>
                <small>of ৳ 30,000 planned</small>
              </div>
            </div>
            <div className="preview-bottom">
              <div>
                <p className="mini-label">SPENDING BREAKDOWN</p>
                <div className="preview-bars">
                  {[43, 72, 48, 91, 62, 80, 54].map((height, index) => (
                    <div key={index}>
                      <i
                        style={{
                          height: height + "%",
                          background: index === 3 ? "#16856c" : "#d8e9df",
                        }}
                      />
                      <small>
                        {["F", "T", "S", "H", "B", "E", "O"][index]}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-transactions">
                <p className="mini-label">YOUR CATEGORIES</p>
                {[
                  [ShoppingBag, "Shopping", "৳ 3,200"],
                  [House, "Home", "৳ 5,500"],
                  [Coffee, "Food & coffee", "৳ 2,850"],
                ].map(([Icon, name, amount]) => (
                  <div key={name}>
                    <span className="tiny-icon">
                      <Icon size={15} />
                    </span>
                    <span>{name}</span>
                    <b>{amount}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="preview-note">
        <span className="icon-tile">
          <ArrowUpRight size={20} />
        </span>
        <div>
          <strong>Small steps. Big possibilities.</strong>
          <span>Build better money habits, every day.</span>
        </div>
      </div>
      <p className="preview-caption">
        Illustrative data · Your dashboard uses your actual expenses
      </p>
    </div>
  );
}
