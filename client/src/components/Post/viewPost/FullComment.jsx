import React, { useEffect, useState } from 'react'
import ViewComment from './ViewComment'
import { useDispatch, useSelector } from 'react-redux';
import { showReplyComments } from '@/redux/commentSlice';

function FullComment({info}) {
  return (
    <div>
        <ViewComment info={info} load={render} reply={replyComments?.length} />
    </div>
  )
}

export default FullComment