import React from 'react'
import  {Link} from 'umi'
import {CopyrightCircleOutlined} from '@ant-design/icons'

const DefaultFooter = () => <div style={{textAlign: 'center', marginBottom: 8}}>
  Copyright <CopyrightCircleOutlined style={{marginRight: 32}}/><Link to={'/about'}>CETC · ZSZ</Link>
</div>;

export default DefaultFooter;
