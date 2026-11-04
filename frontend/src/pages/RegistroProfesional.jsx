import { useState } from 'react'
import Encabezado from '../components/Encabezado.jsx'
import Tarjeta from '../components/Tarjeta.jsx'
import CampoTexto from '../components/CampoTexto.jsx'
import Boton from '../components/Boton.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../api/api.js'
import { mensajeError } from '../utilidades/mensajeError.js'

function RegistroProfesional() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    zona: '',
    telefono: '',
    oficio: ''
  })
  const [dias, setDias] = useState({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false
  })
  const [horaDesde, setHoraDesde] = useState('09:00')
  const [horaHasta, setHoraHasta] = useState('18:00')
  
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleDiaChange = (e) => {
    setDias({ ...dias, [e.target.name]: e.target.checked })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validar que al menos un día esté seleccionado
    const diasSeleccionados = Object.keys(dias).filter(dia => dias[dia])
    if (diasSeleccionados.length === 0) {
      setError('Por favor, seleccioná al menos un día de trabajo.')
      return
    }

    // Armar el string final del horario (Ej: "Lunes, Miércoles, Viernes de 09:00 a 18:00")
    const diasString = diasSeleccionados
      .map(d => d.charAt(0).toUpperCase() + d.slice(1))
      .join(', ')
    const horarioCompleto = `${diasString} de ${horaDesde} a ${horaHasta}`

    setEnviando(true)
    try {
      await api.post('/auth/profesional-register', {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        password: datos.contrasena,
        zona: datos.zona,
        telefono: datos.telefono,
        oficio: datos.oficio,
        disponibilidad: horarioCompleto 
      })
      navigate('/inicio-sesion', {
        state: { mensaje: 'Cuenta creada. Iniciá sesión para continuar.' }
      })
    } catch (requestError) {
      setError(mensajeError(requestError, 'No se pudo crear la cuenta.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Encabezado />
      <div className="pantalla-con-fondo">
        <Tarjeta ancho="900px">
          <h1>Crear cuenta de Profesional</h1>
          <form onSubmit={handleSubmit} className="form-profesional">
            <CampoTexto label="NOMBRE" nombre="nombre" valor={datos.nombre} onChange={handleChange} />
            <CampoTexto label="APELLIDO" nombre="apellido" valor={datos.apellido} onChange={handleChange} />
            <CampoTexto label="EMAIL" nombre="email" tipo="email" valor={datos.email} onChange={handleChange} />
            <CampoTexto label="CONTRASEÑA" nombre="contrasena" tipo="password" valor={datos.contrasena} onChange={handleChange} />
            <CampoTexto label="ZONA DE COBERTURA" nombre="zona" valor={datos.zona} onChange={handleChange} />
            <CampoTexto label="TELÉFONO" nombre="telefono" valor={datos.telefono} onChange={handleChange} />
            
            <div className="campo">
              <label htmlFor="oficio">OFICIO</label>
              <select id="oficio" name="oficio" value={datos.oficio} onChange={handleChange}>
                <option value="">Seleccioná un oficio</option>
                <option value="electricista">Electricista</option>
                <option value="plomero">Plomero</option>
                <option value="pintor">Pintor</option>
                <option value="carpintero">Carpintero</option>
                <option value="albañil">Albañil</option>
                <option value="gasista">Gasista</option>
                <option value="herrero">Herrero</option>
              </select>
            </div>

            {/* NUEVO: SELECTOR DE HORARIOS */}
            <div className="campo campo-full-width">
              <label>DÍAS DE TRABAJO</label>
              <div className="dias-grid">
                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
                  <label key={dia} className="dia-check">
                    <input 
                      type="checkbox" 
                      name={dia} 
                      checked={dias[dia]} 
                      onChange={handleDiaChange} 
                    />
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="campo">
              <label htmlFor="horaDesde">HORARIO DESDE</label>
              <input 
                type="time" 
                id="horaDesde" 
                value={horaDesde} 
                onChange={(e) => setHoraDesde(e.target.value)} 
              />
            </div>

            <div className="campo">
              <label htmlFor="horaHasta">HORARIO HASTA</label>
              <input 
                type="time" 
                id="horaHasta" 
                value={horaHasta} 
                onChange={(e) => setHoraHasta(e.target.value)} 
              />
            </div>

            {error && <p role="alert" className="sin-resultados" style={{ gridColumn: '1 / -1' }}>{error}</p>}
            
            <div className="boton-contenedor">
              <Boton texto={enviando ? 'CREANDO CUENTA...' : 'CREAR CUENTA'} tipo="submit" variante="azul" />
            </div>
          </form>
        </Tarjeta>
      </div>
    </>
  )
}

export default RegistroProfesional