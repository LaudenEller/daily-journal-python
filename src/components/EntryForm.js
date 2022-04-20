import React, { useState, useEffect } from "react"
import { getTags } from "./tags/TagManager"


export const EntryForm = ({ entry, moods, onFormSubmit }) => {
    const [editMode, setEditMode] = useState(false)
    const [updatedEntry, setUpdatedEntry] = useState(entry)
    const [tags, setTags] = useState()
    const [tagsArray, setTagsArray] = useState([])

    useEffect(() => {
        getTags()
            .then((d) => setTags(d))
    }, [])

    useEffect(() => {
        setUpdatedEntry(entry)
        if ('id' in entry) {
            setEditMode(true)
        }
        else {
            setEditMode(false)
        }
    }, [entry])

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
        const newEntry = Object.assign({}, updatedEntry)
        newEntry[event.target.name] = event.target.value
        setUpdatedEntry(newEntry)
    }



    const constructNewEntry = () => {
        const copyEntry = { ...updatedEntry }
        copyEntry.moodId = parseInt(copyEntry.moodId)
        copyEntry.tags = tagsArray
        if (!copyEntry.date) {
            copyEntry.date = Date(Date.now()).toLocaleString('en-us').split('GMT')[0]
        }
        onFormSubmit(copyEntry)
    }

// look into how to save value of checkboxs (eg. .each in jquery)...

    const handleCheckboxChange = (event) => {
       if (tagsArray.indexOf(event.target.value) != -1) {
           // splice value out
           const copyTagsArray = [...tagsArray]
           copyTagsArray.splice(copyTagsArray.indexOf(event.target.value), 1);
           setTagsArray(copyTagsArray)
       }
       else {
           // push value in
           const copyTagsArray = [...tagsArray]
          copyTagsArray.push(event.target.value)
           setTagsArray(copyTagsArray)
       }
    }

    return (
        <article className="panel is-info">
            <h2 className="panel-heading">{editMode ? "Update Entry" : "Create Entry"}</h2>
            <div className="panel-block">
                <form style={{ width: "100%" }}>
                    <div className="field">
                        <label htmlFor="concept" className="label">Concept: </label>
                        <div className="control">
                            <input type="text" name="concept" required autoFocus className="input"
                                proptype="varchar"
                                placeholder="Concept"
                                value={updatedEntry.concept}
                                onChange={handleControlledInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="entry" className="label">Entry: </label>
                        <div className="control">
                            <textarea
                                class="textarea"
                                name="entry"
                                value={updatedEntry.entry}
                                onChange={handleControlledInputChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="moodId" className="label">Mood: </label>
                        <div className="control">
                            <div className="select">
                                <select name="moodId"
                                    proptype="int"
                                    value={updatedEntry.moodId}
                                    onChange={handleControlledInputChange}>

                                    <option value="0">Select a mood</option>
                                    {moods.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <div className="checkbox" value={updatedEntry.tags}>
                                {tags?.map(t => (
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="tags"
                                            key={t.id}
                                            value={t.id}
                                            onChange={handleCheckboxChange}
                                        />
                                        {t.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button type="submit"
                                onClick={evt => {
                                    evt.preventDefault()
                                    constructNewEntry()
                                }}
                                className="button is-link">
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    )
}
