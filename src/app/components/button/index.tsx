import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => (
  <button style={{ ...style }} {...props}>
    {children}
  </button>
)
