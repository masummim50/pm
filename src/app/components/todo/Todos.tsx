
import TodoForm from "./TodoForm";
import TodoContainer from "./TodoContainer";
import useDocumentTitle from "../../../UseDocumentTitle";

const Todos = () => {
  
  useDocumentTitle({title:'Todos'})
  return (
    <div>
      <TodoForm />
      <div style={{display:'flex', justifyContent:'center', color:'red', fontSize:'12px', marginBottom:'10px'}}>Drag and Drop todo from one section to another</div>
      <TodoContainer />
    </div>
  );
};

export default Todos;
