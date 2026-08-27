export default function ChartCard({ title, description, children }) {
  return (
    <section className="chart-card">
      <div className="chart-card-heading">
        <h3>{title}</h3>

        {description && <p>{description}</p>}
      </div>

      {children}
    </section>
  );
}
