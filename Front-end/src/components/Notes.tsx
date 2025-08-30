import React, { useState, Suspense, useEffect } from 'react'
import axios from 'axios';
import type AddNotestype from '../types/AddNote';
import type GetDataTypes from '../types/Getdata';
import Skeleton from 'react-loading-skeleton';
import type Notestype from '../types/NotesTypes';
import { ToastContainer, toast } from 'react-toastify';
// const Welcome = React.lazy(() => {
//   return new Promise<typeof import('./Welcome')>((resolve) => {
//     setTimeout(() => {
//       resolve(import('./Welcome'));
//     }, 2000); // Simulate 2-second delay
//   });
// }
// )
import Welcome from './Welcome';

const Notes = () => {
  const [notes, setNotes] = useState([{ title: "no ", body: "fksdjflsjk", id: "" }]);
  const callErrorToast = (e: String) => toast.error(e, { position: "top-center", })
  const callSucessToast = (e: String) => toast.success(e, { position: "top-center", })
  const [loading, setLoading] = useState(false);
  const [NotePannel, setNotePannel] = useState(false)
  const [userData, setuserData] = useState({
    email: "",
    name: "",
    picture: "",
  })

  const [noteData, setNoteData] = useState({ title: "", body: "", id: "" })

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setNoteData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log(noteData)
  };

  const validate = () => {
    const title = noteData.title.trim()
    const isValid = title.length > 0;

    return isValid;

  }

  const saveNote = async () => {
    if (!validate()) {
      callErrorToast("Title must be valid")
      return
    }
    const res = await axios.post<AddNotestype>(
      `${import.meta.env.VITE_BACK_END_URL}/addNote`, { content: noteData }, { withCredentials: true }
    ); const obj = noteData
    obj.id = res.data.id
    setNotes(prev => [...prev, obj])
    setNotePannel(false)
    setNoteData({ title: "", body: "", id: "" })
  }
  const DiscardNote = () => {
    setNoteData({ title: "", body: "", id: "" })
    setNotePannel(false)

  }

  const deleteNote = (id: string) => {
    axios.post(`${import.meta.env.VITE_BACK_END_URL}/deletNote`, { content: id })
      .then(response => {
        console.log('Note saved:', response.data);
      })
      .catch(error => {
        console.error('Error saving note:', error);
      });
    setNotes(prev => prev.filter(note => note.id !== id));


  }


  useEffect(() => {
    const getData = async () => {
      try {

        setLoading(true)
        const res = await axios.get<GetDataTypes>(
          `${import.meta.env.VITE_BACK_END_URL}/getdata`,
          { withCredentials: true }
        );
        const obj = { name: res.data.userData.name, email: res.data.userData.email, picture: res.data.userData.picture }
        setuserData(obj)
        const resNote = await axios.get<Notestype>(`${import.meta.env.VITE_BACK_END_URL}/getNotes`, { withCredentials: true })
        setNotes(resNote.data.notes);
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }
    getData()
  }, [])






  return (
    <div className="h-screen relative bg-gray-100 flex  items-center justify-center">
      {
        NotePannel &&
        <div className='absolute z-10 h-full w-full bg-black opacity-50 '>

        </div>
      }
      {NotePannel &&


        <div className='absolute z-20 top-[50%] left-[50%] h-full w-full flex items-center justify-center transform translate-x-[-50%] translate-y-[-50%]'>
          <div className='h-[50%] md:w-[50%] w-[90%] border bg-white rounded-2xl p-6'>
            <div className='flex flex-col space-y-3 h-full w-full p-3'>

              <div className="relative  ">
                <label className="absolute -top-2.5  left-2 bg-white px-1 text-xs text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={noteData.title}
                  onChange={handleInput}
                  required
                  className="w-[200px] border borde rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your note title "
                />
              </div>
              <div className="relative h-[80%] w-full ">
                <label className="absolute -top-2.5  left-2 bg-white px-1 text-xs text-gray-600">
                  Discription
                </label>
                <textarea

                  name="body"
                  value={noteData.body}
                  onChange={handleInput}
                  required
                  className="w-full h-full border borde rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discription "
                />
              </div>
              <div className=' space-x-3 flex'>
                <button  className='bg-blue-500  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[50px]'> Save</button>
                <button onClick={DiscardNote} className='bg-red-500  border border-red-600 w-full text-white text-xl hover:bg-red-700 transition duration-400 rounded-md h-[50px] '> Discard</button>


              </div>
            </div>

          </div>
        </div>
      }
      <div className="w-full md:h-[90%] h-full bg-white  max-w-md p-6  rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">

            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <button className="text-sm text-red-500 hover:underline">Sign Out</button>
        </div>

        {/* Welcome Box */}
        {
          loading ? <div className="w-full mx-auto mb-3 text-sm bg-white rounded-lg space-y-6">
            <Skeleton height={70} />
          </div> :
            <Welcome name={userData.name} email={userData.email} />
        }

        {/* Create Note Button */}
        <button
          onClick={() => setNotePannel(true)}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-4"
        >
          Create Note
        </button>

        {/* Notes Section */}
        <div className='overflow-y-auto h-[60%] '>
          <h2 className="text-md font-semibold text-gray-700 mb-2">Notes</h2>
          <ul className="space-y-2">
            {
              loading && <div className="w-full mx-auto mb-3 text-sm bg-white rounded-lg space-y-6">
                <Skeleton height={70} />
              </div>
            }
            {!loading && notes.length < 1 ? <div>no notes yet   </div> :  notes.map((note, index) => (
              <li
                key={index}
                className="flex group  hover:flex-col  justify-between bg-gray-50 p-2 rounded-md shadow-sm"
              >
                <span className='self-start'>{note.title}</span>
                <div className='group-hover:block hidden bg-gray-200 p-3 rounded-md'>
                  {note.body}
                </div>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500 self-end hover:text-red-700"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notes

