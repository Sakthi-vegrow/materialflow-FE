import HomeInput from "../components/HomeInput";
import { GraphView } from "./GraphView";

export const Home = () => {
  return (
    <div className="" style={{ height: "100vh", width: "100vw" }}>
      <HomeInput />
      <GraphView />
    </div>
  );
};
