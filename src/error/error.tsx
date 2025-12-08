import { Link } from "react-router-dom"

export function Error(){

    return(
        <div className=" text-white flex  flex-col w-full h-screen justify-center items-center" >
            <h1 className=" text-6xl"> 404</h1>
            <p className= "m-3 text-2xl "> Essa página não existe😔</p>
            <Link to="/"> <p className="text-violet-600 uppercase font-medium underline underline-offset-1"> Voltar para a home </p></Link>
        </div>
      
    )
}