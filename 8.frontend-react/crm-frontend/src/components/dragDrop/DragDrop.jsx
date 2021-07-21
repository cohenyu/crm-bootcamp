import React, { useState, useCallback, useEffect } from 'react';
import Task from '../task/Task';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


function DragDrop(props) {

    const [items, setItems] = useState([]);

    useEffect(()=>{
        const list = props.items.sort((firstItem, secItem)=>{
            return firstItem.index - secItem.index;
        })
        setItems(list);
        
    }, [props.items])

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        background: isDragging ? "#e4f2ff" : "white",
        ...draggableStyle
      });

    // const removeItem = async (itemId)=>{
    //     const result = props.remove(itemId);
    //     if(result){
    //         const newItems = items.filter((item)=>{
    //             return item.id != itemId;
    //         })
    //         setItems(newItems);
    //     }
    // }

    const reorder = (list, startIndex, endIndex) => {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        props.reorder(result);
        return result;
      };

    const onDragEnd = (result) => {
      
        if (!result.destination) {
          return;
        }
    
        const newItems = reorder(
          items,
          result.source.index,
          result.destination.index
        );
    
        setItems(newItems);
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
                    {items.map((item, index) => (
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
                            {props.getItem(item)}
                            {/* <Task item={item} update={props.update} remove={removeItem}/> */}
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}


               </Droppable>
           </DragDropContext>
       </div>
    )
}

export default DragDrop;
