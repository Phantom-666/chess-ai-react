import "./Ranks.css"

const Ranks = ({ ranks }) => {
  return (
    <div className="ranks">
      {ranks.map((rank, i) => (
        <span key={i}>{rank}</span>
      ))}
    </div>
  )
}

export default Ranks
