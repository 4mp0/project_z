
import './css/Card.css';

export default function Card({ title, content, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <p className="card-content">{content}</p>
    </div>
  );
}