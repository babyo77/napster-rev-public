import { useParams } from "react-router-dom";
import SavedLibrary from "./SavedLibrary";
import Library from "./Library";

function RememberLib() {
  const { id } = useParams();
  return !id ? <SavedLibrary /> : <Library />;
}

export { RememberLib };
