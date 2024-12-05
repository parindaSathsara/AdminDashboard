import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon,hidden, ...rest } = item
    const Component = component
    if(!hidden){
      return (
        <Component
          {...(rest.to &&
            !rest.items && {
            component: NavLink,
          })}
          key={index}
          {...rest}
        >
          {navLink(name, icon, badge)}
        </Component>
      )
    }
    else{
      return null
    }
   
  }
  const navGroup = (item, index) => {
    const { component, name, icon, to,hidden, ...rest } = item
    const Component = component

    if(!hidden){
      return (
        <Component
          idx={String(index)}
          key={index}
          toggler={navLink(name, icon)}
          visible={location.pathname.startsWith(to)}
          {...rest}
        >
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </Component>
      )
    }
    else{
      return null
    }
   
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>

  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
