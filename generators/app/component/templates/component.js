import React, { FC } from 'react'
import './<%= camelCaseName %>.scss'

interface <%= componentName %>Props {}

const <%= componentName %>: FC<<%= componentName %>Props> = (props) => {

  const {} = props;

  return (
    <div>
      <%= componentName %> Initialised 
    </div>
  )
}
  
export default <%= componentName %>;