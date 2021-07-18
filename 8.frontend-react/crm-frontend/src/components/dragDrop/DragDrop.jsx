import React, { useState, useCallback, useEffect } from 'react';
import Task from '../task/Task';
import {useDrop} from 'react-dnd';
import update from 'immutability-helper';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CrmApi from '../../helpers/CrmApi';

function DragDrop(props) {
    const crmApi = new CrmApi();

    const [tasks, setTasks] = useState([]);

    useEffect(()=>{
      
        const list = props.tasks.sort((firstItem, secItem)=>{
            return firstItem.index - secItem.index;
        })
        console.log("new list: ", list);
        setTasks(list);
        
    }, [props.tasks])

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        background: isDragging ? "#e4f2ff" : "white",
        ...draggableStyle
      });

    const removeTask = async (taskId)=>{
        const result = crmApi.deleteTask({taskId: taskId});
        if(result){
            const newTasks = tasks.filter((item)=>{
                return item.id != taskId;
            })
            setTasks(newTasks);
        }
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        console.log("reorder", result);
        const dataToSent = result.map((item, index)=>{
            return {taskId: item.id, set: {task_index: index}};
        })
        console.log("data: ", dataToSent);
        crmApi.updateTasksIndex(dataToSent);
        return result;
      };

    const onDragEnd = (result) => {
      
        if (!result.destination) {
          return;
        }
    
        const items = reorder(
          tasks,
          result.source.index,
          result.destination.index
        );
    
        setTasks(items);
    }

    const updateTask = () => {

    }

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightgray" : 'white',
      });

    return (
       <div>
           <DragDropContext onDragEnd={onDragEnd}>
               <Droppable droppableId='droppable'>
                    
               {(provided, snapshot) => (
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    >
                    {tasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                            <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                            <Task title={item.title} done={item.done !== "0"} id={item.id} removeTask={removeTask} updateTask={updateTask}/>
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}


               </Droppable>
           </DragDropContext>
           {/* {tasks.map((task, index) => renderTask(task, index))} */}
       </div>
    )
}

export default DragDrop;
