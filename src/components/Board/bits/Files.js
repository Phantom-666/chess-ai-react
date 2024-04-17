import { getCharacters } from "../../../utils"
import "./Files.css"

const Files = ({ files }) => {
  return (
    <div className="files">
      {files.map((file, i) => (
        <span key={i}>{getCharacters(file)}</span>
      ))}
    </div>
  )
}

export default Files
