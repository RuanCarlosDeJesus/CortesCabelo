
import { auth } from "../services/firebaseConnect";
export function Home(){
    return (
        <div>
            <h1 className="text-white text-4xl">Home Page</h1>
            <button   onClick={() => auth.signOut()} className="text-3xl text-red-500"> logout
                
            </button>
        </div>
    )
}
export default Home;