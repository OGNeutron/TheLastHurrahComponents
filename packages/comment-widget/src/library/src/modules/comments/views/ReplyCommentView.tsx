import React, { useState } from 'react'
import { ArrowLeft } from '@mui/icons-material'
import { Comment } from 'semantic-ui-react'
import Moment from 'react-moment'

import { IComment } from '../components/Comment'
import { EditCommentForm } from '../components/EditComment'
import { ReplyCommentForm } from '../components/ReplyCommentForm'
import { CurrentUserQuery } from '../../../generated/graphql'

interface IReplyCommentView {
    deleteComment: (id: string) => void
    deleteReplyComment: (id: string, parent_id: string) => void
    changeUseEdit: React.Dispatch<React.SetStateAction<boolean>>
    reply: IComment
    currentUser: CurrentUserQuery | undefined
    limit: number
    skip: number
    website_url: string
    title: string
    comment: IComment
}

export const ReplyCommentView: React.FC<IReplyCommentView> = ({
    deleteReplyComment,
    changeUseEdit,
    reply,
    limit,
    skip,
    website_url,
    title,
    comment,
    currentUser,
}) => {
    const [useSecondaryReply, changeUseEditSecondary] = useState(false)
    const [useReplyEdit, changeUseReplyEdit] = useState(false)

    return (
        <Comment key={reply.id}>
            <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
            <Comment.Content>
                <Comment.Author as="a">{reply.author.username}</Comment.Author>
                <Comment.Metadata>
                    <ArrowLeft />
                    Replied To {reply.replied_to_user?.username}
                </Comment.Metadata>
                <Comment.Metadata>
                    <Moment format="DD/MM/YYYY">{reply.created_at}</Moment>
                </Comment.Metadata>
                <Comment.Text>
                    {useReplyEdit ? (
                        <EditCommentForm
                            changeUseReplyEdit={changeUseReplyEdit}
                            comment_id={reply.id}
                            changeUseEdit={changeUseEdit}
                            comment_body={reply.body}
                        />
                    ) : (
                        reply.body
                    )}
                </Comment.Text>
                <Comment.Actions>
                    <Comment.Action
                        onClick={() =>
                            changeUseEditSecondary(!useSecondaryReply)
                        }
                    >
                        Reply
                    </Comment.Action>
                    {currentUser &&
                    currentUser.current_user.id === reply.author.id ? (
                        <>
                            <Comment.Action
                                onClick={() =>
                                    changeUseReplyEdit(!useReplyEdit)
                                }
                            >
                                Edit
                            </Comment.Action>
                            <Comment.Action
                                onClick={() => {
                                    if (reply.parent_id) {
                                        deleteReplyComment(
                                            reply.id,
                                            reply.parent_id,
                                        )
                                    }
                                }}
                            >
                                delete
                            </Comment.Action>
                        </>
                    ) : (
                        ''
                    )}
                </Comment.Actions>
                {useSecondaryReply ? (
                    <ReplyCommentForm
                        website_url={website_url}
                        limit={limit}
                        skip={skip}
                        title={title}
                        comment={comment}
                        replied_to_id={reply.author.id}
                        changeUseMain={changeUseEditSecondary}
                        parent_id={comment.id}
                    />
                ) : (
                    ''
                )}
            </Comment.Content>
        </Comment>
    )
}