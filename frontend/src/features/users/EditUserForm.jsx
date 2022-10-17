import React, { useState, useEffect } from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { ROLES } from '../../config/roles'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@$%]{8-12}$/

const EditUserForm = () => {
    
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

        if (isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            > {role}
            </option>
        )
    })

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave

    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading        
    }
    
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? "form__input--incomplete" : ''
    const validPwdClass = password && !validPassword ? "form__input--incomplete" : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disable={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onDeleteUserClicked}
                            disable={!canSave}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>

                    <label className="form__label" htmlFor="username">
                        Username: <span className="nowrap">[3-20 letters]</span>
                    </label>
                    <input
                        className={`form__input ${validUserClass}`}
                        id="username" 
                        type="text"
                        name="username"
                        autoComplete='off'
                        value={username}
                        onChange={onUsernameChanged} 
                    />

                    <label className="form__label" htmlFor="password">
                        Password: <span className="nowrap">[8-12 chars included.]</span>
                    </label>
                    <input
                        className={`form__input ${validPwdClass}`}
                        id="password" 
                        type="password"
                        name="password"
                        autoComplete='off'
                        value={password}
                        onChange={onPasswordChanged} 
                    />
                    
                    <label className="form__label form__checkbox-container" htmlFor="user-active">
                        Active:
                    </label>
                    <input 
                        className={`form__select ${validRolesClass}`}
                        name="user-active" 
                        id="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    >
                    </input>

                    <label className="form__label" htmlFor="roles">
                        Assigned Roles:
                    </label>
                    <select 
                        className={`form__select ${validRolesClass}`}
                        name="roles" 
                        id="roles"
                        multiple={true}
                        size="3"
                        value={roles}
                        onChange={onRolesChanged}
                    >
                        {options}
                    </select>
                </div>
            </form>
        </>
    )

    return content
}

export default EditUserForm