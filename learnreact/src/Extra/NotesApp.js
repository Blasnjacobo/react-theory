import React from "react"
import Sidebar from "./Sidebar"
import Editor from "./Editor"
//import { data } from "./data"
import Split from "react-split"
//import {nanoid} from "nanoid"
import "./NotesApp.css"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"


export default function NotesApp() {

     /* 2. When the app first loads, initialize the notes state
     *    with the notes saved in localStorage. You'll need to
     *    use JSON.parse() to turn the stringified array back
     *    into a real JS array.
     */

     /**
     * Challenge:
     * Lazily initialize our `notes` state so it doesn't
     * reach into localStorage on every single re-render
     * of the App component ---> SOLUTION IS ADDING A FUNCTION SUCH AS () =>
     */

    const [notes, setNotes] = React.useState([]
         //() => JSON.parse(localStorage.getItem("notes")) || []
        )      
    //If you are trying to take som edata from the local storage but it doesnt have any its going to return undefined, 
    //so instead its going to use a brand new empty array
    const [currentNoteId, setCurrentNoteId] = React.useState(""
        //(notes[0] && notes[0].id) || ""
        //(notes[0]?.id) || ""
    )

    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]
    
        const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    /*
    1. Every time the `notes` array changes, save it 
    *    in localStorage. You'll need to use JSON.stringify()
    *    to turn the array into a string to save in localStor age.
    */

    /*React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    },[notes])*/  

    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])



    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            //id: nanoid(),
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        //setNotes(prevNotes => [newNote, ...prevNotes])
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id) 
    }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(
            docRef, 
            { body: text, updatedAt: Date.now() }, 
            { merge: true }
            )
        /*setNotes(oldNotes => {
            const newArr = []
            for (let i = 0; i< oldNotes.length; i++){
                const oldNote = oldNotes[i]
                if (oldNote.id === currentNoteId){
                    newArr.unshift({...oldNote, body:text})
                } else{
                    newArr.push(oldNote)
                }
            }
            return newArr
        })*/ 
    }

    //  THIS DOES NOT REARRAGE THE NODES
    // function updateNote(text) {
    //     setNotes(oldNotes => oldNotes.map(oldNote => {
            
    //         return oldNote.id === currentNoteId
    //             ? { ...oldNote, body: text }
    //             : oldNote
    //     }))
    // }

    async function deleteNote(noteId) {
        //event.stopPropagation()
        //setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId));
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote = {deleteNote}
                />
                {
                    <Editor 
                    tempNoteText={tempNoteText}
                    setTempNoteText={updateNote}
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
