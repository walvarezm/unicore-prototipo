//$(document).ready(function() {

            // Initialize Giros Nacionales data ***************************************************
            if (!localStorage.getItem('girosNacionales')) {
                const initialGirosData = [
                    {
                        id: 1,
                        nroLote: 'LOTE 10001',
                        solTransferencia: 'TP - DE UNA CUENTA A VARIAS CUENTAS',
                        nroCuenta: '10002027020200',
                        usuario: 'MIAMANI',
                        nombreCompleto: 'Mirna Mariel Mamani Camara',
                        uEjecutora: '2306',
                        regional: 'LA PAZ',
                        tipoTransaccion: 'Debito de CC/CA',
                        oficinaSolicitante: 'Servicio al Cliente La Paz',
                        estado: 'Solicitado',
                        fechaCreacion: '2025-01-15',
                        beneficiarios: [
                            {
                                id: 1,
                                regional: 'COCHABAMBA',
                                nroDoc: '12345678-OPLP',
                                beneficiario: 'JUAN CARLOS RODRIGUEZ LOPEZ',
                                moneda: 'Bs.',
                                importeEnviar: 1000.00,
                                comision: 10.00,
                                cobrarCom: 'Debitante',
                                itf: 3.00,
                                importeEnviado: 1000.00,
                                direccion: 'Av. Heroinas #123, Cochabamba',
                                telefono: '70123456',
                                correo: 'juan.rodriguez@email.com'
                            }
                        ],
                        autorizador: {
                            usuario: 'SUPERVISOR01',
                            nombreCompleto: 'CARLOS ERNESTO SUPERVISOR',
                            cargo: 'SUPERVISOR DE OPERACIONES'
                        }
                    },
                                        {
                        id: 3,
                        nroLote: 'LOTE 10003',
                        solTransferencia: 'TP - DE UNA CUENTA A VARIAS CUENTAS',
                        nroCuenta: '24299116',
                        usuario: 'JATAPIA',
                        nombreCompleto: 'Jazmin Alejandra Tapia Rada',
                        uEjecutora: '2306',
                        regional: 'LA PAZ',
                        tipoTransaccion: 'Debito de CC/CA',
                        oficinaSolicitante: 'Servicio al Cliente La Paz',
                        estado: 'Aprobado',
                        fechaCreacion: '2025-06-15',
                        beneficiarios: [
                            {
                                id: 1,
                                regional: 'COCHABAMBA',
                                nroDoc: '12345678-OPLP',
                                beneficiario: 'JUAN CARLOS RODRIGUEZ LOPEZ',
                                moneda: 'Bs.',
                                importeEnviar: 1000.00,
                                comision: 10.00,
                                cobrarCom: 'Debitante',
                                itf: 3.00,
                                importeEnviado: 1000.00,
                                direccion: 'Av. Heroinas #123, Cochabamba',
                                telefono: '70123456',
                                correo: 'juan.rodriguez@email.com'
                            }
                        ],
                        autorizador: {
                            usuario: 'SUPERVISOR01',
                            nombreCompleto: 'CARLOS ERNESTO SUPERVISOR',
                            cargo: 'SUPERVISOR DE OPERACIONES'
                        }
                    }
                ];
                localStorage.setItem('girosNacionales', JSON.stringify(initialGirosData));
            }

            // Initialize autorizadores data
            if (!localStorage.getItem('autorizadores')) {
                const autorizadoresData = [
                    { id: 1, usuario: 'ERONERO', nombreCompleto: 'ERNESTO ROMERO GARCIA', cargo: 'SUPERVISOR DE OPERACIONES' },
                    { id: 2, usuario: 'CRESPO', nombreCompleto: 'MARIA CRESPO VALDEZ', cargo: 'SUPERVISOR DE OPERACIONES' },
                    { id: 3, usuario: 'SUPERVISOR01', nombreCompleto: 'CARLOS ERNESTO SUPERVISOR', cargo: 'SUPERVISOR DE OPERACIONES' },
                    { id: 4, usuario: 'JEFE01', nombreCompleto: 'ANA PATRICIA JEFE', cargo: 'JEFE DE OPERACIONES' }
                ];
                localStorage.setItem('autorizadores', JSON.stringify(autorizadoresData));
            }

            // Load Giros Nacionales CRUD
            function loadGirosNacionalesCRUD(operation) {
                $('#panel3Title').text('📋 Solicitudes de Envío de Giros Nacionales');
                $('#panel3Actions').html(`
                    <button class="btn btn-success" onclick="openRegistroManual()">📝 Registro Manual</button>
                    <button class="btn btn-primary" onclick="openRegistroArchivo()">📁 Registro por Archivo de Datos</button>
                    <button class="btn btn-info" onclick="refreshGirosData()">🔄 Actualizar</button>
                `);

                loadGirosData(operation);
            }

            // Load giros data
            function loadGirosData(operation) {
                const girosData = JSON.parse(localStorage.getItem('girosNacionales') || '[]');
                //renderGirosTable(girosData);

                //const girosAutorizacionData = JSON.parse(localStorage.getItem('girosAutorizacion') || '[]');



                //var operationEstado = operation === 'Autorización'? 'SOLICITADO' : 'APROBADO';

                currentGirosAutorizacionData = JSON.parse(localStorage.getItem('girosAutorizacion') || '[]');
                // Filter only SOLICITADO status and today's requests
                //const today = new Date().toISOString().split('T')[0];
                filteredGirosAutorizacionData = currentGirosAutorizacionData.filter(giro => 
                    giro.estado === 'SOLICITADO'
                    //giro.estado === 'SOLICITADO' || giro.estado === 'APROBADO' || giro.estado === 'OBSERVADO' // && giro.fechaSolicitud === today
                );


                renderGirosTable(filteredGirosAutorizacionData,operation);
            }

            let tipoRegistro = 'manual'; // Default to manual
            // Render giros table
            function renderGirosTable(data,operation) {
                let tableHTML = `
                    <div class="table-header-tools" style="margin-bottom: 15px;">
                        <span>Total de registros: ${data.length}</span>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nro. de LOTE</th>
                                <th>Sol. Transferencia</th>
                                <th>Nro. de Cuenta</th>
                                <th>Usuario</th>
                                <th>Nombre Completo</th>
                                <th>U.Ejecutora</th>
                                <th>Regional</th>
                                <th>Tipo Transacción</th>
                                <th>Oficina Solicitante</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.forEach(giro => {
                    const statusClass = getStatusClass(giro.estado);
                    var hiddenRow = giro.estado === 'APROBADO' ? 'hidden-row' : '';
                    var showPrintRow = giro.estado === 'APROBADO' ? '' : 'hidden-row';
                    tableHTML += `
                        <tr>
                            <td><strong>${giro.nroLote}</strong></td>
                            <td>${giro.solTransferencia}</td>
                            <td>${giro.nroCuenta}</td>
                            <td>${giro.usuario}</td>
                            <td>${giro.nombreCompleto}</td>
                            <td>${giro.uEjecutora}</td>
                            <td>${giro.regional}</td>
                            <td>${giro.tipoTransaccion}</td>
                            <td>${giro.oficinaSolicitante}</td>
                            <td><span class="status-badge ${statusClass}">${giro.estado}</span></td>
                            <td>
                                <!-- <button class="btn btn-sm btn-primary ${hiddenRow}" onclick="viewGiro(${giro.id})" title="Ver">👁️</button> -->
                                <button class="btn btn-sm btn-warning ${hiddenRow}" onclick="openAutorizacionModal(${giro.id},'${operation}')" title="Editar">✏️</button>
                                <button class="btn btn-sm btn-danger ${hiddenRow}" onclick="deleteGiro(${giro.id})" title="Eliminar">🗑️</button>
                                <button class="btn btn-sm btn-success ${showPrintRow}" onclick="deleteGiro(${giro.id})" title="Imprimir">🗑️</button>
                            </td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                $('#content-panel-3').html(tableHTML);
            }

            // Open Registro Manual modal
            window.openRegistroManual = function() {
                //showGiroModal('manual');
                tipoRegistro = 'manual';
                openAutorizacionModal('create','manual', 'Solicitudes');
                
            };

            // Open Registro por Archivo modal
            window.openRegistroArchivo = function() {
                showFileUploadModal();
            };

            // Show file upload modal
            function showFileUploadModal() {
                $('#modal-title').text('Registro por Archivo de Datos');
                $('#modal-body').html(`
                    <div class="form-group">
                        <label>Seleccionar Archivo Excel:</label>
                        <input type="file" id="fileInput" accept=".xlsx,.xls" class="form-control">
                        <small class="text-muted">Formatos permitidos: .xlsx, .xls</small>
                    </div>
                    <div class="form-group">
                        <label>Descripción:</label>
                        <textarea id="fileDescription" rows="3" placeholder="Descripción del archivo (opcional)"></textarea>
                    </div>
                `);
                
                $('#modal-footer').html(`
                    <button class="btn btn-primary" onclick="cargarArchivoDatos()">📁 Cargar Archivo de Datos</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                `);
                
                $('#modal').show();
            }

            // Cargar archivo de datos
            window.cargarArchivoDatos = function() {
                const fileInput = document.getElementById('fileInput');
                if (!fileInput.files.length) {
                    showAlert('Por favor seleccione un archivo.', 'warning');
                    return;
                }
                
                // Simular carga de archivo
                showAlert('Archivo cargado exitosamente. Procesando datos...', 'success');
                closeModal();
                
                // Abrir modal con datos del archivo
                setTimeout(() => {
                    //showGiroModal('archivo');
                    tipoRegistro = 'archivo';
                    openAutorizacionModal('create','archivo', 'Solicitudes');

                }, 1000);
            };

            // Show giro modal (manual or archivo)
            function showGiroModal(tipo) {
                tipoRegistro = tipo; // Guardar tipo de registro para uso posterior
                const isArchivo = tipo === 'archivo';
                const title = isArchivo ? 
                    'Registro de Envío de Giros Nacionales con Débito a Cuenta - Por Archivo de Datos' :
                    'Registro de Envío de Giros Nacionales con Débito a Cuenta - Manual';
                
                $('#modal-title').text(title);

                // Agregar clase fullscreen al modal-content
                $('.modal-content').addClass('fullscreen');
                
                const modalBody = `
                    <div style="max-height: 70vh; overflow-y: auto;">
                        <!-- Formulario de Debitante -->
                        <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                            <h4 style="margin-bottom: 20px; color: #2a5298;">📋 Datos del Cliente Debitante</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Nro Solicitud:</label>
                                    <input type="text" id="cuentaDebitar" value="" readonly>
                                </div>
                                <div class="form-group">
                                    <label>DEBITAR de la Cuenta:</label>
                                    <input type="text" id="cuentaDebitar" value="10002027020200" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Razón Social:</label>
                                    <input type="text" id="razonSocial" value="COMPAÑÍA INDUSTRIAL DE TABACOS" readonly>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Saldo Disponible:</label>
                                    <input type="text" id="saldoDisponible" value="1.000.000,00" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Producto:</label>
                                    <input type="text" id="producto" value="CTA. CTE. M/N" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Estado:</label>
                                    <input type="text" id="estadoCuenta" value="CUENTA ACTIVA" readonly>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"></div>
                                <div class="form-group">
                                    <label>Total Bolivianos:</label>
                                    <input type="number" id="totalBolivianos" value="1000.00" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label>Total Comisiones:</label>
                                    <input type="number" id="totalComisiones" value="10.00" step="0.01">
                                </div>
                                <div class="form-group"></div>
                                <div class="form-group">
                                    <label>Importe Total Bolivianos:</label>
                                    <input type="number" id="importeTotalBs" value="1010.00" step="0.01" readonly>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"></div>
                                <div class="form-group">
                                    <label>Total Dólares:</label>
                                    <input type="number" id="totalDolares" value="4000.00" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label>Total Comisiones:</label>
                                    <input type="number" id="totalComisiones" value="10.00" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label>Total I.T.F.:</label>
                                    <input type="number" id="totalITF" value="12.00" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label>Importe Total Dólares:</label>
                                    <input type="number" id="importeTotalUsd" value="4052.00" step="0.01" readonly>
                                </div>
                            </div>
                            <div class="form-row">
                                
                                <div class="form-group">
                                    <label>Factura a Favor de:</label>
                                    <input type="text" id="facturaFavor" value="COMPAÑÍA INDUSTRIAL DE TABACOS">
                                </div>
                                <div class="form-group">
                                    <label>Correo Electrónico:</label>
                                    <input type="email" id="correoElectronico" value="xxxxxxx@xxxx.xxx.xx">
                                </div>
                                <div class="form-group">
                                    <label>N.I.T.:</label>
                                    <input type="text" id="nit" value="1234567890123456">
                                </div>
                                <div class="form-group"></div>
                            </div>
                            <div class="form-row">
                                
                                <div class="form-group">
                                    <label>Concepto Envío de Giro:</label>
                                    <textarea id="conceptoEnvio" rows="2">SCITE: 321/2019 - PAGO A PROVEEDORES DE TABACO - GESTION 2019</textarea>
                                </div>

                            </div>
                        </div>

                        <!-- Tabla de Beneficiarios -->
                        <div class="beneficiarios-section">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <h4 style="color: #2a5298;">👥 Detalle de Giros a Enviar</h4>
                                ${!isArchivo ? '<button class="btn btn-success btn-sm" onclick="agregarBeneficiario()">➕ Agregar Beneficiario</button>' : ''}
                            </div>
                            
                            <div id="beneficiariosTable">
                                <!-- Tabla será generada dinámicamente -->
                            </div>
                        </div>

                        <!-- Sección de Autorizador -->
                        <div class="autorizador-section" style="margin-top: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                                <div class="form-group" style="margin: 0; flex: 1;">
                                    <label>.</label>
                                    <button class="btn btn-primary" onclick="asignarAutorizador()">👤 Asignar Autorizador</button>
                                </div>
                                <div class="form-group" style="margin: 0; flex: 1;">
                                    <label>Usuario:</label>
                                    <input type="text" id="autorizadorUsuario" readonly>
                                </div>
                                <div class="form-group" style="margin: 0; flex: 2;">
                                    <label>Nombre Completo:</label>
                                    <input type="text" id="autorizadorNombre" readonly>
                                </div>
                                <div class="form-group" style="margin: 0; flex: 1;">
                                    <label>Cargo:</label>
                                    <input type="text" id="autorizadorCargo" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    
    $('#modal-body').html(modalBody);
    
    $('#modal-footer').html(`
        <button class="btn btn-success" onclick="enviarSolicitudGiro('${tipo}')">📤 Enviar Solicitud</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    `);
    
    // Generar tabla de beneficiarios
    generateBeneficiariosTable(isArchivo);
    
    $('#modal').show();
}

// Generate beneficiarios table
function generateBeneficiariosTable(isArchivo) {
    const beneficiarios = girosAutorizacionData[2] ? girosAutorizacionData[2].beneficiarios : [];
    const beneficiarios22 = [
        {
            id: 1,
            regional: 'COCHABAMBA',
            nroDoc: '12345678-OPLP',
            beneficiario: 'JUAN CARLOS RODRIGUEZ LOPEZ',
            moneda: 'Bs.',
            importeEnviar: 1000.00,
            comision: 10.00,
            cobrarCom: 'Debitante',
            itf: 3.00,
            importeEnviado: 1000.00,
            direccion: 'Av. Heroinas #123, Cochabamba',
            telefono: '70123456',
            correo: 'juan.rodriguez@email.com',
            estado: 'Pendiente'
        },
        {
            id: 2,
            regional: 'SANTA CRUZ',
            nroDoc: '87654321-3MSC',
            beneficiario: 'MARIA FERNANDA SILVA TORRES',
            moneda: 'Bs.',
            importeEnviar: 1500.00,
            comision: 15.00,
            cobrarCom: 'Debitante',
            itf: 4.50,
            importeEnviado: 1500.00,
            direccion: 'Calle Libertad #456, Santa Cruz',
            telefono: '75987654',
            correo: 'maria.silva@email.com',
            estado: 'Pendiente'
        }
    ];

    let tableHTML = `
        <table class="data-table" style="font-size: 12px;">
            <thead>
                <tr>
                    ${isArchivo ? '<th><input type="checkbox" id="selectAll" onchange="toggleSelectAll()"></th>' : ''}
                    <th>Regional</th>
                    <th>No.Doc.Identificación</th>
                    <th>Beneficiario del Giro</th>
                    <th>Moneda</th>
                    <th>Importe a Enviar</th>
                    <th>Comisión</th>
                    <th>Cobrar Com.</th>
                    <th>I.T.F.</th>
                    <th>Importe Enviado</th>
                    <th>Dirección Beneficiario</th>
                    <th>Teléfono</th>
                    <th>Correo Electrónico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    beneficiarios.forEach(ben => {
        const statusClass = getStatusClass(ben.estado);
        tableHTML += `
            <tr>
                ${isArchivo ? `<td><input type="checkbox" class="beneficiario-check" value="${ben.id}"></td>` : ''}
                <td>${ben.regional}</td>
                <td>${ben.nroDoc}</td>
                <td>${ben.beneficiario}</td>
                <td>${ben.moneda}</td>
                <td>${ben.importeEnviar.toFixed(2)}</td>
                <td>${ben.comision.toFixed(2)}</td>
                <td>${ben.cobrarCom}</td>
                <td>${ben.itf.toFixed(2)}</td>
                <td>${ben.importeEnviado.toFixed(2)}</td>
                <td>${ben.direccion}</td>
                <td>${ben.telefono}</td>
                <td>${ben.correo}</td>
                <td><span class="status-badge ${statusClass}">${ben.estado}</span></td>
                <td>
                    <div style="display: flex; gap: 5px;">
                    ${isArchivo ? 
                        `<button class="btn btn-sm btn-success" onclick="aceptarBeneficiario(${ben.id})" title="Aceptar">✓</button>
                         <button class="btn btn-sm btn-danger" onclick="rechazarBeneficiario(${ben.id})" title="Rechazar">✗</button>` :
                        `<button class="btn btn-sm btn-warning" onclick="editarBeneficiario(${ben.id})" title="Editar">✏️</button>
                         <button class="btn btn-sm btn-danger" onclick="eliminarBeneficiario(${ben.id})" title="Eliminar">🗑️</button>`
                    }
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Cantidad de Registros:</strong> ${beneficiarios.length}</span>
                <span><strong>Total Bolivianos:</strong> ${beneficiarios.reduce((sum, b) => sum + b.importeEnviar, 0).toFixed(2)}</span>
                <span><strong>Total Comisiones:</strong> ${beneficiarios.reduce((sum, b) => sum + b.comision, 0).toFixed(2)}</span>
            </div>
        </div>
    `;

    $('#beneficiariosTable').html(tableHTML);
}



// Asignar autorizador
window.asignarAutorizador = function(mode, giroId, operation) {
    showAutorizadorModal(mode, giroId, operation);
};

// Show autorizador selection modal
function showAutorizadorModal(mode, giroId, operation) {
    const autorizadores = JSON.parse(localStorage.getItem('autorizadores') || '[]');
    
    $('#modal-title').text('Selección de Control Dual');

    // Agregar clase fullscreen al modal-content
    $('.modal-content').removeClass('fullscreen');
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Nombre Completo</th>
                    <th>Cargo</th>
                    <th>Seleccionar</th>
                </tr>
            </thead>
            <tbody>
    `;

    autorizadores.forEach(auth => {
        tableHTML += `
            <tr>
                <td>${auth.usuario}</td>
                <td>${auth.nombreCompleto}</td>
                <td>${auth.cargo}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="seleccionarAutorizador(${auth.id},'${mode}',${giroId},'${operation}')">Seleccionar</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    $('#modal-body').html(tableHTML);
    $('#modal-footer').html(`
        <button class="btn btn-secondary" onclick="cerrarAutorizadorModal('${mode}',${giroId},'${operation}')">Cancelar</button>
    `);
    
    $('#modal').show();
}

// Seleccionar autorizador
window.seleccionarAutorizador = function(id,mode, giroId, operation) {
    const autorizadores = JSON.parse(localStorage.getItem('autorizadores') || '[]');
    const autorizador = autorizadores.find(a => a.id === id);
    
    if (autorizador) {
        // Cerrar modal de selección
        closeModal();
        
        // Reabrir modal principal con datos del autorizador
        setTimeout(() => {
            //showGiroModal(tipoRegistro); // o 'archivo' según corresponda
            openAutorizacionModal(mode, giroId, operation);
            
            // Llenar campos del autorizador
            $('#autorizadorUsuario').val(autorizador.usuario);
            $('#autorizadorNombre').val(autorizador.nombreCompleto);
            $('#autorizadorCargo').val(autorizador.cargo);
            
            showAlert('Autorizador asignado exitosamente.', 'success');
        }, 100);
    }
};

// Cerrar modal de autorizador
window.cerrarAutorizadorModal = function(mode, giroId, operation) {
    closeModal();
    setTimeout(() => {
        //showGiroModal(tipoRegistro); // Reabrir modal principal
        openAutorizacionModal(mode, giroId, operation);
    }, 100);
};

// Enviar solicitud de giro
window.enviarSolicitudGiro = function(tipo, giroId, mode= 'create') {

    var textMessage = mode === 'create' ? '¿Está seguro de Registrar y Enviar la Solicitud de Giro Nacional para Aprobación?' : 'Está seguro de Modificar la Solicitud de Giro Nacional para Aprobación';
    showConfirmModal(
        'Confirmar Envío',
        textMessage,
        () => {
            // Simular envío
            showAlert('Solicitud de Giro Nacional enviada para Aprobacion exitosamente.', 'success');
            createSolicitudGiro(tipo, giroId, mode);
            closeModal('-confirm');
            closeModal();
            refreshGirosAutorizacionData('Solicitudes');
            //refreshGirosData();
        }
    );
    // Agregar clase fullscreen al modal-content
    $('.modal-content-confirm').removeClass('fullscreen');
};

// Create solicitud
window.createSolicitudGiro = function(tipo, giroId, mode) {
    if (validateSolicitudGiroForm()) {


        const autorizadorUsuario = $(`#autorizadorUsuario`).val();
        const autorizadorNombre = $(`#autorizadorNombre`).val();
        const autorizadorCargo = $(`#autorizadorCargo`).val();

        var currentGirosData;
        if( mode === 'edit') {

            currentGirosAutorizacionData = JSON.parse(localStorage.getItem('girosAutorizacion') || []);
            const giroIndex = currentGirosAutorizacionData.findIndex(g => g.id === giroId);
            
            if (giroIndex === -1) return;

            currentGirosAutorizacionData[giroIndex].estado = 'SOLICITADO';
            currentGirosAutorizacionData[giroIndex].fechaModificacion = new Date().toISOString();
            currentGirosAutorizacionData[giroIndex].autorizadorUsuario = autorizadorUsuario;
            currentGirosAutorizacionData[giroIndex].autorizadorNombre = autorizadorNombre;
            currentGirosAutorizacionData[giroIndex].autorizadorCargo = autorizadorCargo;

        }else{
            newSolicitudGiro = girosAutorizacionData[2] ;
            newSolicitudGiro.id = Math.max(...currentGirosAutorizacionData.map(s => s.id), 0) + 1;
            newSolicitudGiro.nroLote = `LOTE ${newSolicitudGiro.id.toString().padStart(5, '0')}`;
            newSolicitudGiro.fechaSolicitud = new Date().toISOString().split('T')[0];
            newSolicitudGiro.tipoTransaccion = tipo;
            newSolicitudGiro.autorizadorUsuario = autorizadorUsuario;
            newSolicitudGiro.autorizadorNombre = autorizadorNombre;
            newSolicitudGiro.autorizadorCargo = autorizadorCargo;
            currentGirosAutorizacionData.push(newSolicitudGiro);
        }

        //const newSolicitudGiro = girosAutorizacionData[2] ;
        

        localStorage.setItem('girosAutorizacion', JSON.stringify(currentGirosAutorizacionData));
        //loadSolicitudesData();
        //closeModal();
        //showAlert('Solicitud creada exitosamente.', 'success');
    }
};

// Validate form
function validateSolicitudGiroForm() {
    return true;
    const requiredFields = ['referencia', 'fecha', 'numeroCuenta', 'tipoCuenta', 'titular', 'cantidad', 'tipoChequera', 'direccionEntrega'];
    let isValid = true;

    requiredFields.forEach(field => {
        const value = $(`#${field}`).val();
        if (!value || value.trim() === '') {
            $(`#${field}`).css('border-color', '#dc3545');
            isValid = false;
        } else {
            $(`#${field}`).css('border-color', '#28a745');
        }
    });

    if (!isValid) {
        showAlert('Por favor complete todos los campos requeridos.', 'danger');
    }

    return isValid;
}

window.editarDatosFacturaDebitante = function(id, mode) {
    //showAlert(`Editando beneficiario ID: ${id}`, 'info');

    if(mode === 'edit') {
        $('#debitanteFacturaFavor').attr('readonly', false);
        $('#debitanteCorreoElectronico').attr('readonly', false);
        $('#debitanteNit').attr('readonly', false);

        $('#debitanteFacturaFavor').attr('style', 'background: white;');
        $('#debitanteCorreoElectronico').attr('style', 'background: white;');
        $('#debitanteNit').attr('style', 'background: white;');

        $('#buttonEditarDatosFactura').addClass('hidden-row');
        $('#buttonGuardarDatosFactura').removeClass('hidden-row');
        $('#buttonCancelarEditarDatosFactura').removeClass('hidden-row');

    }else if(mode === 'cancel') {
        $('#debitanteFacturaFavor').attr('readonly', true);
        $('#debitanteCorreoElectronico').attr('readonly', true);
        $('#debitanteNit').attr('readonly', true);

        $('#debitanteFacturaFavor').attr('style', 'background: #e9ecef;');
        $('#debitanteCorreoElectronico').attr('style', 'background: #e9ecef;');
        $('#debitanteNit').attr('style', 'background: #e9ecef;');

        $('#buttonEditarDatosFactura').removeClass('hidden-row');
        $('#buttonGuardarDatosFactura').addClass('hidden-row');
        $('#buttonCancelarEditarDatosFactura').addClass('hidden-row');

        showAlert('Edición de datos de la factura del debitante cancelada.', 'info');

    }else if(mode === 'save') {
        $('#debitanteFacturaFavor').attr('readonly', true);
        $('#debitanteCorreoElectronico').attr('readonly', true);
        $('#debitanteNit').attr('readonly', true);

        $('#debitanteFacturaFavor').attr('style', 'background: #e9ecef;');
        $('#debitanteCorreoElectronico').attr('style', 'background: #e9ecef;');
        $('#debitanteNit').attr('style', 'background: #e9ecef;');

        $('#buttonEditarDatosFactura').removeClass('hidden-row');
        $('#buttonGuardarDatosFactura').addClass('hidden-row');
        $('#buttonCancelarEditarDatosFactura').addClass('hidden-row');

        showAlert('Datos de la factura del debitante actualizados exitosamente.', 'success');

    }

};

// Otras funciones de beneficiarios
window.agregarBeneficiario = function(mode = 'create', operation = 'Solicitudes') {
    showAlert('Función de agregar beneficiario en desarrollo.', 'info');

let ben = {
    id: filteredBeneficiariosData.length + 1,
    regional: 'BENI',
    nroDoc: '99887766-4BE',
    beneficiario: 'CARLOS EDUARDO RIVERA SANTOS',
    moneda: 'Bs.',
    importeEnviar: 2000.00,
    comision: 20.00,
    cobrarCom: 'Debitante',
    itf: 6.00,
    importeEnviado: 2000.00,
    direccion: 'Barrio Central, Calle Principal #456, Trinidad',
    telefono: '76543210',
    correo: 'carlos.rivera@email.com',
    estado: 'Pendiente'
}

const isView = mode === 'view';
    const isEdit = mode === 'edit';
    const isCreate = mode === 'create';
    const isAutorize = mode === 'autorize';
const hiddenButton = operation === 'Autorización' && !isView? '' : operation === 'Solicitudes' && (isCreate || isEdit)? '' : ' hidden-row';

const isShowEdit = (isEdit || isAutorize ); // && tipoRegistro == 'archivo';




const statusClass = getStatusClass(ben.estado);
    $('#tablaBeneficiarios>tbody').append(`
            <tr>
                <td><input type="text" id="regional" value="${ben.regional}"></td>
                <td><input type="text" id="nroDoc" value="${ben.nroDoc}"></td>
                <td><input type="text" id="beneficiario" value="${ben.beneficiario}"></td>
                <td><input type="text" id="moneda" value="${ben.moneda}"></td>
                <td><input type="text" id="importeEnviar" value="${ben.importeEnviar}"></td>
                <td><input type="text" id="comision" value="${ben.comision}"></td>
                <td><input type="text" id="cobrarCom" value="${ben.cobrarCom}"></td>
                <td><input type="text" id="itf" value="${ben.itf}"></td>
                <td><input type="text" id="importeEnviado" value="${ben.importeEnviado}"></td>
                <td><input type="text" id="direccion" value="${ben.direccion}"></td>
                <td><input type="text" id="telefono" value="${ben.telefono}"></td>
                <td><input type="text" id="correo" value="${ben.correo}"></td>
                <td><span class="status-badge ${statusClass}">${ben.estado}</span></td>
                <td class="${hiddenButton}">
                    <div style="display: flex; gap: 5px;">
                        ${ isShowEdit? `
                            <button class="btn btn-sm btn-success ${hiddenButton}" onclick="aprobarBeneficiarioIndividual(${ben.id},'${mode}','${operation}')" title="Aprobar" ${ben.estado === 'Aprobado' ? 'disabled' : ''}>✓</button>
                        <button class="btn btn-sm btn-danger ${hiddenButton}" onclick="rechazarBeneficiarioIndividual(${ben.id},'${mode}','${operation}')" title="Rechazar" ${ben.estado === 'Rechazado' ? 'disabled' : ''}>✗</button>
                            `: `<button class="btn btn-sm btn-success" onclick="guardarBeneficiario(${ben.id},'${mode}','${operation}')" title="Editar">✏️</button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarBeneficiario(${ben.id})" title="Eliminar">🗑️</button>`}
                    </div>
                </td>
            </tr>
    `);
};

window.guardarBeneficiario = function(benId, mode,operation) {
   // showAlert(`Guardando beneficiario ID: ${id}`, 'info');

   let ben = {
    id: benId,
    regional: $(`#regional`).val(),
    nroDoc: $(`#nroDoc`).val(),
    beneficiario: $(`#beneficiario`).val() ,
    moneda:  $(`#moneda`).val() ,
    importeEnviar:  $(`#importeEnviar`).val(),
    comision: $(`#comision`).val(),
    cobrarCom: $(`#cobrarCom`).val(),
    itf: $(`#itf`).val(),
    importeEnviado: $(`#importeEnviado`).val(),
    direccion: $(`#direccion`).val(),
    telefono: $(`#telefono`).val(),
    correo: $(`#correo`).val(),
    estado: 'Pendiente'
}


        //filteredBeneficiariosData = [...currentBeneficiariosData];
        filteredBeneficiariosData.push(ben);
        renderBeneficiariosAutorizacionTable(mode,operation);
};
window.editarBeneficiario = function(id) {
    showAlert(`Editando beneficiario ID: ${id}`, 'info');
};

window.eliminarBeneficiario = function(id) {
    showAlert(`Eliminando beneficiario ID: ${id}`, 'info');
};

window.aceptarBeneficiario = function(id) {
    aprobarBeneficiarioIndividual(id);
    showAlert(`Beneficiario ID: ${id} aceptado.`, 'success');
};

window.rechazarBeneficiario = function(id) {
    rechazarBeneficiarioIndividual(id);
    showAlert(`Beneficiario ID: ${id} rechazado.`, 'warning');
};

// Toggle select all
window.toggleSelectAll = function() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.beneficiario-check');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
};

// CRUD functions for giros
window.viewGiro = function(id) {
    showAlert(`Viendo giro ID: ${id}`, 'info');
};

window.editGiro = function(id) {
    showAlert(`Editando giro ID: ${id}`, 'info');
};

window.deleteGiro = function(id, operation) {

    var currentGirosData = currentGirosAutorizacionData.find(s => s.id === id);
    showConfirmModal(
        'Confirmar Eliminación',
        '¿Está seguro que desea eliminar la Solicitud Nro.: <b>'+ currentGirosData.nroLote +'</b>?<br>Si confirma, No hay retroceso de esta acción.',
        () => {
            showAlert('Giro eliminado exitosamente.', 'success');

            currentGirosAutorizacionData = currentGirosAutorizacionData.filter(s => s.id !== id);
            localStorage.setItem('girosAutorizacion', JSON.stringify(currentGirosAutorizacionData));

            closeModal('-confirm');
            //refreshGirosData();
            refreshGirosAutorizacionData(operation);

        }
    );
};

// Search and filter functions
window.searchGiros = function() {
    showAlert('Búsqueda de giros realizada.', 'info');
};

window.clearSearchGiros = function() {
    document.getElementById('searchGirosForm').reset();
    showAlert('Filtros limpiados.', 'info');
};

window.exportGirosData = function() {
    showAlert('Datos de giros exportados.', 'success');
};

window.refreshGirosData = function() {
    loadGirosData('Solicitudes');
    showAlert('Datos actualizados.', 'success');
};


/*************************************************************************** */

const girosAutorizacionData = [
    {
        id: 1,
        nroLote: 'LOTE 10001',
        fechaSolicitud: '2024-01-16',
        solTransferencia: 'TM - DE VARIAS CUENTAS A UNA CUENTA',
        nroCuenta: '10002027020200',
        usuario: 'MIAMANI',
        nombreCompleto: 'Mirna Mariel Mamani Camara',
        uEjecutora: '2306',
        regional: 'LA PAZ',
        tipoTransaccion: 'Masiva',
        oficinaSolicitante: 'Oficina Central',
        estado: 'SOLICITADO',
        debitante: {
            cuentaDebitar: '10002027020200',
            razonSocial: 'COMPAÑÍA INDUSTRIAL DE TABACOS',
            saldoDisponible: '1.000.000,00',
            producto: 'CTA. CTE. M/N',
            estadoCuenta: 'CUENTA ACTIVA',
            totalBolivianos: 5000.00,
            totalComisiones: 50.00,
            importeTotalBs: 5050.00,
            totalDolares: 0.00,
            totalITF: 15.00,
            importeTotalUsd: 0.00,
            facturaFavor: 'COMPAÑÍA INDUSTRIAL DE TABACOS',
            correoElectronico: 'contabilidad@tabacalera.com',
            nit: '1234567890123456',
            conceptoEnvio: 'SCITE: 321/2019 - PAGO A PROVEEDORES DE TABACO - GESTION 2019'
        },
        beneficiarios: [
            {
                id: 1,
                regional: 'COCHABAMBA',
                nroDoc: '12345678-OPLP',
                beneficiario: 'JUAN CARLOS RODRIGUEZ LOPEZ',
                moneda: 'Bs.',
                importeEnviar: 2500.00,
                comision: 25.00,
                cobrarCom: 'Debitante',
                itf: 7.50,
                importeEnviado: 2500.00,
                direccion: 'Av. Heroinas #123, Cochabamba',
                telefono: '70123456',
                correo: 'juan.rodriguez@email.com',
                estado: 'Pendiente'
            },
            {
                id: 2,
                regional: 'SANTA CRUZ',
                nroDoc: '87654321-3MSC',
                beneficiario: 'MARIA FERNANDA SILVA TORRES',
                moneda: 'Bs.',
                importeEnviar: 2500.00,
                comision: 25.00,
                cobrarCom: 'Debitante',
                itf: 7.50,
                importeEnviado: 2500.00,
                direccion: 'Calle Libertad #456, Santa Cruz',
                telefono: '75987654',
                correo: 'maria.silva@email.com',
                estado: 'Pendiente'
            }
        ]
    },
    {
        id: 2,
        nroLote: 'LOTE 10003',
        fechaSolicitud: '2024-01-16',
        solTransferencia: 'TI - DE UNA CUENTA A VARIAS CUENTAS',
        nroCuenta: '20003038030300',
        usuario: 'JPEREZ',
        nombreCompleto: 'Juan Carlos Perez Mamani',
        uEjecutora: '2307',
        regional: 'COCHABAMBA',
        tipoTransaccion: 'Individual',
        oficinaSolicitante: 'Sucursal Cochabamba',
        estado: 'SOLICITADO',
        debitante: {
            cuentaDebitar: '20003038030300',
            razonSocial: 'EMPRESA CONSTRUCTORA BOLIVIANA S.A.',
            saldoDisponible: '500.000,00',
            producto: 'CTA. CTE. M/N',
            estadoCuenta: 'CUENTA ACTIVA',
            totalBolivianos: 3000.00,
            totalComisiones: 30.00,
            importeTotalBs: 3030.00,
            totalDolares: 0.00,
            totalITF: 9.00,
            importeTotalUsd: 0.00,
            facturaFavor: 'EMPRESA CONSTRUCTORA BOLIVIANA S.A.',
            correoElectronico: 'finanzas@constructora.com',
            nit: '9876543210987654',
            conceptoEnvio: 'PAGO A SUBCONTRATISTAS - PROYECTO EDIFICIO CENTRAL'
        },
        beneficiarios: [
            {
                id: 3,
                regional: 'LA PAZ',
                nroDoc: '11223344-1LP',
                beneficiario: 'PEDRO ANTONIO MAMANI QUISPE',
                moneda: 'Bs.',
                importeEnviar: 1500.00,
                comision: 15.00,
                cobrarCom: 'Debitante',
                itf: 4.50,
                importeEnviado: 1500.00,
                direccion: 'Zona Sur, Calle 21 #789, La Paz',
                telefono: '72345678',
                correo: 'pedro.mamani@email.com',
                estado: 'Pendiente'
            },
            {
                id: 4,
                regional: 'ORURO',
                nroDoc: '55667788-2OR',
                beneficiario: 'ANA LUCIA VARGAS CONDORI',
                moneda: 'Bs.',
                importeEnviar: 1500.00,
                comision: 15.00,
                cobrarCom: 'Debitante',
                itf: 4.50,
                importeEnviado: 1500.00,
                direccion: 'Av. 6 de Agosto #321, Oruro',
                telefono: '78901234',
                correo: 'ana.vargas@email.com',
                estado: 'Pendiente'
            }
        ]
    },
    {
        id: 3,
        nroLote: 'LOTE 10004',
        fechaSolicitud: '2025-06-18',
        solTransferencia: 'TP - DE UNA CUENTA A VARIAS CUENTAS',
        nroCuenta: '30004049040400',
        usuario: 'MLOPEZ',
        nombreCompleto: 'Maria Elena Lopez Gutierrez',
        uEjecutora: '2308',
        regional: 'SANTA CRUZ',
        tipoTransaccion: 'Masiva',
        oficinaSolicitante: 'Sucursal Santa Cruz',
        estado: 'SOLICITADO',
        debitante: {
            cuentaDebitar: '30004049040400',
            razonSocial: 'COOPERATIVA AGROPECUARIA INTEGRAL',
            saldoDisponible: '750.000,00',
            producto: 'CTA. CTE. M/N',
            estadoCuenta: 'CUENTA ACTIVA',
            totalBolivianos: 8000.00,
            totalComisiones: 80.00,
            importeTotalBs: 8080.00,
            totalDolares: 0.00,
            totalITF: 24.00,
            importeTotalUsd: 0.00,
            facturaFavor: 'COOPERATIVA AGROPECUARIA INTEGRAL',
            correoElectronico: 'administracion@cooperativa.com',
            nit: '5555666677778888',
            conceptoEnvio: 'PAGO A PRODUCTORES AGRICOLAS - COSECHA 2024'
        },
        beneficiarios: [
            {
                id: 5,
                regional: 'BENI',
                nroDoc: '99887766-4BE',
                beneficiario: 'CARLOS EDUARDO RIVERA SANTOS',
                moneda: 'Bs.',
                importeEnviar: 2000.00,
                comision: 20.00,
                cobrarCom: 'Debitante',
                itf: 6.00,
                importeEnviado: 2000.00,
                direccion: 'Barrio Central, Calle Principal #456, Trinidad',
                telefono: '76543210',
                correo: 'carlos.rivera@email.com',
                estado: 'Pendiente'
            },
            {
                id: 6,
                regional: 'PANDO',
                nroDoc: '44332211-5PA',
                beneficiario: 'ROSA MARIA FERNANDEZ CHOQUE',
                moneda: 'Bs.',
                importeEnviar: 3000.00,
                comision: 30.00,
                cobrarCom: 'Debitante',
                itf: 9.00,
                importeEnviado: 3000.00,
                direccion: 'Zona Norte, Av. Libertad #123, Cobija',
                telefono: '73456789',
                correo: 'rosa.fernandez@email.com',
                estado: 'Pendiente'
            },
            {
                id: 7,
                regional: 'TARIJA',
                nroDoc: '66778899-6TA',
                beneficiario: 'LUIS FERNANDO MORALES TICONA',
                moneda: 'Bs.',
                importeEnviar: 3000.00,
                comision: 30.00,
                cobrarCom: 'Debitante',
                itf: 9.00,
                importeEnviado: 3000.00,
                direccion: 'Barrio San Roque, Calle Sucre #789, Tarija',
                telefono: '79012345',
                correo: 'luis.morales@email.com',
                estado: 'Pendiente'
            }
        ]
    },
    {
        id: 0,
        nroLote: '',
        fechaSolicitud: new Date().toISOString().split('T')[0],
        solTransferencia: 'TP - DE UNA CUENTA A VARIAS CUENTAS',
        nroCuenta: '',
        usuario: 'MLOPEZ',
        nombreCompleto: 'Maria Elena Lopez Gutierrez',
        uEjecutora: '2309',
        regional: 'COCHAMABA',
        tipoTransaccion: 'Manual',
        oficinaSolicitante: 'Sucursal La Paz',
        estado: 'SOLICITADO',
        debitante: {
            cuentaDebitar: '',
            razonSocial: '',
            saldoDisponible: '',
            producto: '',
            estadoCuenta: '',
            totalBolivianos: 0,
            totalComisiones: 0,
            importeTotalBs: 0,
            totalDolares: 0,
            totalITF: 0,
            importeTotalUsd: 0,
            facturaFavor: '',
            correoElectronico: '',
            nit: '',
            conceptoEnvio: ''
        },
        beneficiarios: [
        ]
    }
];

// Initialize more giros data for authorization
if (!localStorage.getItem('girosAutorizacion')) {
 
    localStorage.setItem('girosAutorizacion', JSON.stringify(girosAutorizacionData));
}


function loadGirosAutorizacionCRUD(operation){

    tipoOperacionGiros = operation;

    const servicioSeleccionado = JSON.parse(localStorage.getItem('servicioSeleccionado') || {});
    const operacionSeleccionada = servicioSeleccionado.operaciones.find(c => c.operacion == operation);
    localStorage.setItem('operacionSeleccionada', JSON.stringify(operacionSeleccionada || {}));

    if(operation == 'Reportes'){
        loadGirosReportesCRUD();
    }else{
        loadGirosAutorizacion(operation);
    }

}

// Load Giros Autorización CRUD
function loadGirosAutorizacion(operation) {

    tipoOperacionGiros = operation;

    const operacionSeleccionada = JSON.parse(localStorage.getItem('operacionSeleccionada') || {});

    // Panel 2 - Search/Filter
    $('#panel2Content').html(`
        <form class="search-form" id="searchGirosForm">
            <div class="form-group">
                <label>Fecha Inicio:</label>
                <input type="date" id="searchFechaInicio" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Fecha Final:</label>
                <input type="date" id="searchFechaFinal" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Número de Lote:</label>
                <input type="text" id="searchNumeroLote" placeholder="LOTE 10001">
            </div>
            <div class="form-group">
                <label>Número de Cuenta:</label>
                <input type="text" id="searchNumeroCuenta" placeholder="10002027020200">
            </div>
            <div class="search-actions">
                <button type="button" class="btn btn-primary" onclick="searchGirosAutorizacion()">🔍 Buscar</button>
                <button type="button" class="btn btn-secondary" onclick="clearSearchGirosAutorizacion('${operation}')">🗑️ Limpiar</button>
                <button type="button" class="btn btn-info" onclick="exportGirosAutorizacionData()">📊 Exportar</button>
            </div>
        </form>
    `);


    //var tituloOperationGN = operation === 'Autorización'? 'Aprobar/Rechazar Envío de Giros Nacionales SOLICITADOS' : 'Impresion/Reimpresion de Envío de Giros Nacionales APROBADOS';
    var tituloOperationGN = operacionSeleccionada.tituloPanel3 + ' de Envío de Giros Nacionales';

    // Panel 3 - Data List
    /*$('#panel3Title').text('📋 ' + tituloOperationGN);
    $('#panel3Actions').html(`
        <button class="btn btn-info" onclick="refreshGirosAutorizacionData('${operation}')">🔄 Actualizar</button>
    `);*/


    $('#panel3Title').text('📋 ' + tituloOperationGN);
    $('#panel3Actions').html(`
        ${operacionSeleccionada.mostrarBotonRegistro? `
        <button class="btn btn-success " onclick="openRegistroManual()">📝 Registro Manual</button>
        <button class="btn btn-primary" onclick="openRegistroArchivo()">📁 Registro por Archivo de Datos</button>`:''}
        <button class="btn btn-info" onclick="refreshGirosAutorizacionData('${operacionSeleccionada.operacion}')">🔄 Actualizar</button>
    `);

    loadGirosAutorizacionData(operacionSeleccionada.operacion);
}

// Variables for authorization
let currentGirosAutorizacionData = [];
let filteredGirosAutorizacionData = [];
let currentGirosAutorizacionPage = 1;
let girosAutorizacionItemsPerPage = 5;
let tipoOperacionGiros = 'Solicitudes'; // Default operation type

// Load giros authorization data
function loadGirosAutorizacionData(operation) {

    const operacionSeleccionada = JSON.parse(localStorage.getItem('operacionSeleccionada') || {});

    let operationEstados = operacionSeleccionada.estado.split("|");
    //let mode = moduloChequesGerencia.mode;

    //tipoOperacionGiros = operation;
    operation = operacionSeleccionada.operacion; //  operation || tipoOperacionGiros;

    //var operationEstado = operation === 'Solicitudes'? ['SOLICITADO', 'RECHAZADO'] : operation === 'Autorización'? ['SOLICITADO'] : operation === 'Impresion'? ['APROBADO']:[];

    currentGirosAutorizacionData = JSON.parse(localStorage.getItem('girosAutorizacion') || '[]');
    // Filter only SOLICITADO status and today's requests
    //const today = new Date().toISOString().split('T')[0];
    filteredGirosAutorizacionData = currentGirosAutorizacionData.filter(giro => 
        //giro.estado === operationEstado
        operationEstados.includes(giro.estado)
        //giro.estado === 'SOLICITADO' || giro.estado === 'APROBADO' || giro.estado === 'OBSERVADO' // && giro.fechaSolicitud === today
    );

let tableHTML = `
            <div class="giros-section">
                <div class="table-header-tools" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0px; background: #f8f9fa; border-radius: 5px;">
                    <h4 style="color: #2a5298; margin: 0;">Giros Nacionales</h4>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="text" id="tableSearchGiros" placeholder="Buscar Solicitados..." style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;" onkeyup="filterGirosAutorizacionTable('${operation}')">
                        <button class="btn btn-sm btn-secondary" onclick="clearTableSearchGiros('${operation}')">🗑️</button>
                    </div>
                </div>
                
                <div id="girosAutorizacionTable" style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                    <!-- Tabla será generada dinámicamente -->
                </div>
            </div>
`;

    $('#content-panel-3').html(tableHTML);

    renderGirosAutorizacionTable(operation);
}

// Render giros authorization table
function renderGirosAutorizacionTable(operation) {

    const operacionSeleccionada = JSON.parse(localStorage.getItem('operacionSeleccionada') || {});
    //console.log(operation);
    operation = operacionSeleccionada.operacion;
    //operation = operation || tipoOperacionGiros;

    const startIndex = (currentGirosAutorizacionPage - 1) * girosAutorizacionItemsPerPage;
    const endIndex = startIndex + girosAutorizacionItemsPerPage;
    const pageData = filteredGirosAutorizacionData.slice(startIndex, endIndex);

    //var operationEstado = operation === 'Autorización'? 'SOLICITADO' : 'APROBADO';

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nro. de LOTE</th>
                    <th>Fecha Solicitud</th>
                    <th>Sol. Transferencia</th>
                    <th>Nro. de Cuenta</th>
                    <th>Usuario</th>
                    <th>Nombre Completo</th>
                    <th>U.Ejecutora</th>
                    <th>Regional</th>
                    <th>Tipo Transacción</th>
                    <th>Oficina Solicitante</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageData.forEach(giro => {
        const statusClass = getStatusClass(giro.estado);
        var showEditDeleteRow = (giro.estado === 'SOLICITADO') && operation === 'Solicitudes' ? 'edit' : 'hidden-row';
        var showViewRow = (giro.estado === 'SOLICITADO' || giro.estado === 'APROBADO'  || giro.estado === 'RECHAZADO')? 'view' : 'hidden-row';
        var showProcessRow = giro.estado === 'SOLICITADO'  && operation === 'Autorización' ? 'autorize' : 'hidden-row';
        var showPrintRow = giro.estado === 'APROBADO' && operation === 'Impresion'? 'print' : 'hidden-row';
        var showRechazadoText = giro.estado === 'RECHAZADO'? '👁️ Motivo Rechazo: '+giro.motivoRechazo : '';

        tableHTML += `
            <tr>
                <td><strong>${giro.nroLote}</strong></td>
                <td>${giro.fechaSolicitud}</td>
                <td>${giro.solTransferencia}</td>
                <td>${giro.nroCuenta}</td>
                <td>${giro.usuario}</td>
                <td>${giro.nombreCompleto}</td>
                <td>${giro.uEjecutora}</td>
                <td>${giro.regional}</td>
                <td>${giro.tipoTransaccion}</td>
                <td>${giro.oficinaSolicitante}</td>
                <td><span class="status-badge ${statusClass}" title="${showRechazadoText}">${giro.estado}</span></td>
                <td>

                    <button class="btn btn-sm btn-primary ${showViewRow}" onclick="openAutorizacionModal('${showViewRow}',${giro.id},'${operation}')" title="Ver">👁️</button>

                    <button class="btn btn-sm btn-warning ${showEditDeleteRow}" onclick="openAutorizacionModal('${showEditDeleteRow}',${giro.id},'${operation}')" title="Editar">✏️</button>
                    <button class="btn btn-sm btn-danger ${showEditDeleteRow}" onclick="deleteGiro(${giro.id},'${operation}')" title="Eliminar">🗑️</button>

                    <button class="btn btn-sm btn-warning ${showProcessRow}" onclick="openAutorizacionModal('${showProcessRow}',${giro.id},'${operation}')" title="Aprobar/Rechazar">⚖️</button>
                    <button class="btn btn-sm btn-success ${showPrintRow}" onclick="openAutorizacionModal('${showPrintRow}',${giro.id},'${operation}')" title="Imprimir">📋</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
        <div  class="table-header-tools" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <span>Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredGirosAutorizacionData.length)} de ${filteredGirosAutorizacionData.length} registros</span>
   
        </div>
    `;

    // Add pagination
    tableHTML += renderGirosAutorizacionPagination();

    //$('#content-panel-3').html(tableHTML);
    $('#girosAutorizacionTable').html(tableHTML);
}

// Render pagination for giros authorization
function renderGirosAutorizacionPagination() {
    const totalPages = Math.ceil(filteredGirosAutorizacionData.length / girosAutorizacionItemsPerPage);
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    paginationHTML += `<button onclick="changeGirosAutorizacionPage(${currentGirosAutorizacionPage - 1})" ${currentGirosAutorizacionPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentGirosAutorizacionPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentGirosAutorizacionPage - 2 && i <= currentGirosAutorizacionPage + 2)) {
            paginationHTML += `<button onclick="changeGirosAutorizacionPage(${i})">${i}</button>`;
        } else if (i === currentGirosAutorizacionPage - 3 || i === currentGirosAutorizacionPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `<button onclick="changeGirosAutorizacionPage(${currentGirosAutorizacionPage + 1})" ${currentGirosAutorizacionPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;
    
    paginationHTML += '</div>';
    return paginationHTML;
}

// Change page for giros authorization
window.changeGirosAutorizacionPage = function(page) {
    const totalPages = Math.ceil(filteredGirosAutorizacionData.length / girosAutorizacionItemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentGirosAutorizacionPage = page;
        renderGirosAutorizacionTable();
    }
};

// Filter table search for giros authorization
window.filterGirosAutorizacionTable = function(operation) {

    //var operationEstado = operation === 'Solicitudes' || operation === 'Autorización'? 'SOLICITADO' : operation === 'Impresion'?'APROBADO':'';

    const operacionSeleccionada = JSON.parse(localStorage.getItem('operacionSeleccionada') || {});
    let operationEstados = operacionSeleccionada.estado.split("|");

    const searchTerm = $('#tableSearchGiros').val().toLowerCase();
    const allData = JSON.parse(localStorage.getItem('girosAutorizacion') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    filteredGirosAutorizacionData = allData.filter(giro => {
        //const matchesStatus = giro.estado === 'SOLICITADO' && giro.fechaSolicitud === today;
        const matchesStatus = operationEstados.includes(giro.estado);
        const matchesSearch = searchTerm === '' || 
            giro.nroLote.toLowerCase().includes(searchTerm) ||
            giro.nroCuenta.includes(searchTerm) ||
            giro.usuario.toLowerCase().includes(searchTerm) ||
            giro.nombreCompleto.toLowerCase().includes(searchTerm) ||
            giro.regional.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });
    
    currentGirosAutorizacionPage = 1;
    renderGirosAutorizacionTable(operation);
};

// Clear table search for giros authorization
window.clearTableSearchGiros = function(operation) {
    $('#tableSearchGiros').val('');
    //filterGirosAutorizacionTable();
    loadGirosAutorizacionData(operation);
};

// Search giros authorization
window.searchGirosAutorizacion = function(operation) {

    var operationEstado = operation === 'Solicitudes' || operation === 'Autorización'? 'SOLICITADO' : operation === 'Impresion'?'APROBADO':'';

    const operacionSeleccionada = JSON.parse(localStorage.getItem('operacionSeleccionada') || {});
    let operationEstados = operacionSeleccionada.estado.split("|");

    const fechaInicio = $('#searchFechaInicio').val();
    const fechaFinal = $('#searchFechaFinal').val();
    const numeroLote = $('#searchNumeroLote').val().toLowerCase();
    const numeroCuenta = $('#searchNumeroCuenta').val();

    const allData = JSON.parse(localStorage.getItem('girosAutorizacion') || '[]');
    
    /*
    filteredGirosAutorizacionData = allData.filter(giro => {
        let matches = true; // giro.estado === operationEstado; //'SOLICITADO' || giro.estado === 'APROBADO';
        
        //if (operationEstado && giro.estado !== operationEstado) matches = false;
        if (operationEstados && !operationEstados.includes(giro.estado)) matches = false;
        if (fechaInicio && giro.fechaSolicitud < fechaInicio) matches = false;
        if (fechaFinal && giro.fechaSolicitud > fechaFinal) matches = false;
        if (numeroLote && !giro.nroLote.toLowerCase().includes(numeroLote)) matches = false;
        if (numeroCuenta && !giro.nroCuenta.includes(numeroCuenta)) matches = false;
        
        return matches;
    });*/

    filteredGirosAutorizacionData = allData.filter(giro => {
        //const matchesStatus = giro.estado === 'SOLICITADO' && giro.fechaSolicitud === today;
        const matchesStatus = operationEstados.includes(giro.estado);
        const matchesSearch = numeroLote === '' || numeroCuenta === '' || fechaInicio === '' || fechaFinal === '' || 
            giro.nroLote.toLowerCase().includes(numeroLote) ||
            giro.nroCuenta.includes(numeroCuenta) ||
            giro.fechaSolicitud > fechaInicio ||
            giro.fechaSolicitud < fechaFinal;
        
        return matchesStatus && matchesSearch;
    });

    currentGirosAutorizacionPage = 1;
    renderGirosAutorizacionTable(operation);
    showAlert('Búsqueda realizada. ' + filteredGirosAutorizacionData.length + ' registros encontrados.', 'info');
};

// Clear search giros authorization
window.clearSearchGirosAutorizacion = function(operation) {
    $('#searchGirosForm')[0].reset();
    const today = new Date().toISOString().split('T')[0];
    $('#searchFechaInicio').val(today);
    $('#searchFechaFinal').val(today);
    loadGirosAutorizacionData(operation);
    showAlert('Filtros limpiados.', 'info');
};

// Export giros authorization data
window.exportGirosAutorizacionData = function() {
    showAlert('Datos de autorización exportados.', 'success');
};

// Refresh giros authorization data
window.refreshGirosAutorizacionData = function(operation) {
    loadGirosAutorizacionData(operation);
    showAlert('Datos actualizados en <b>' + operation + '</b>', 'info');
    //showAlert('222Datos actualizados.', 'danger');
};



// Open authorization modal
window.openAutorizacionModal = function(mode, giroId, operation) {
    
    const tipo = tipoRegistro
    const indexTipoData = tipoRegistro == 'manual' ? 3: tipoRegistro == 'archivo' ? 2: giroId;
    const isView = mode === 'view';
    const isEdit = mode === 'edit' && ['Solicitudes'].includes(operation);
    const isCreate = mode === 'create' && ['Solicitudes'].includes(operation);
    const isAutorize = mode === 'autorize';
    const isPrint = mode === 'print';
    const showReadonly = mode === 'create'? ' style="background: white;"' : 'readonly style="background: #e9ecef;"';
    const showEditField = mode === 'create' || mode === 'edit'? ' style="background: white;"' : 'readonly style="background: #e9ecef;"';

    var giro = girosAutorizacionData[3] ? girosAutorizacionData[3] : [];

    if(isCreate){
        giro = girosAutorizacionData[indexTipoData] ? girosAutorizacionData[indexTipoData] : [];
        giro.nroLote = 'LOTE ' + (Math.max(...currentGirosAutorizacionData.map(s => s.id), 0) + 1).toString().padStart(5, '0');
        giro.fechaSolicitud = new Date().toISOString().split('T')[0];
        giroId = 0; // New giro ID
    }else{
        giro = currentGirosAutorizacionData.find(g => g.id === giroId);
        if (!giro) return;
    }

    var tituloEstadoGiro = isCreate? 'Registro de Solicitud de Envio de Giro Nacional': giro.estado === 'SOLICITADO' && operation === 'Solicitudes' && isEdit? 'Editar Solicitud de Envio de Giro Nacional' : (giro.estado === 'SOLICITADO' && operation === 'Autorización' && isAutorize? 'Aprobar/Rechazar Solicitud de Giro Nacional' : giro.estado === 'APROBADO' && operation === 'Impresion' && isPrint? 'Imprimir Solicitud de Giro Nacional' : 'Detalles del Giro Nacional');
    const hiddenButton = giro.estado === 'SOLICITADO' && operation === 'Autorización' && isAutorize? '' : ' hidden-row';
    
    $('#modal-title').text(tituloEstadoGiro +' con Débito a Cuenta: ' + giro.nroLote);
    
    // Add fullscreen class
    $('.modal-content').addClass('fullscreen');
    
    const modalBody = `
        <div style="height: 100%; overflow-y: auto;">
            <div class="tab-section-header" id="" onclick="mostrarOcultarForm('form-section-gn')">
                <h3> Datos del Cliente Debitante</h3>
                <span class="panel-2-toggle collapsed" id="panel2Toggle-form-section-gn">▼</span>
            </div>
            <!-- Formulario de Debitante (Solo lectura) -->
            <div class="form-section form-section-content" id="form-section-gn" style="margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
                <h4 style="margin-bottom: 15px; color: #2a5298; border-bottom: 2px solid #2a5298; padding-bottom: 8px;">📋 Datos del Cliente Debitante</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nro Solicitud:</label>
                        <input type="text" id="nroLote" value="${giro.nroLote}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>DEBITAR de la Cuenta:</label>
                        <input type="text" id="debitanteCuentaDebitar" value="${giro.debitante.cuentaDebitar}" ${showReadonly} oninput="buscarCuentaDebitar()" placeholder="30004049040400">
                    </div>
                    <div class="form-group">
                        <label>Razón Social:</label>
                        <input type="text" id="debitanteRazonSocial" value="${giro.debitante.razonSocial}" readonly style="background: #e9ecef;">
                    </div>
                    <!-- <div class="form-group">
                        <label></label>
                    </div> -->
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Saldo Disponible:</label>
                        <input type="text" id="debitanteSaldoDisponible" value="${giro.debitante.saldoDisponible}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Producto:</label>
                        <input type="text" id="debitanteProducto" value="${giro.debitante.producto}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Estado:</label>
                        <input type="text" id="debitanteEstadoCuenta" value="${giro.debitante.estadoCuenta}" readonly style="background: #e9ecef;">
                    </div>
                    <!-- <div class="form-group">
                        <label>Foto Firma:</label>
                        <button type="button" class="btn btn-info btn-sm" disabled>Ver Firma</button>
                    </div> -->
                </div>
                <div class="form-row">
                    <div class="form-group"></div>
                    <div class="form-group">
                        <label>Total Bolivianos:</label>
                        <input type="text" value="${giro.debitante.totalBolivianos.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Total Comisiones:</label>
                        <input type="text" value="${giro.debitante.totalComisiones.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group"></div>
                    <div class="form-group">
                        <label>Importe Total Bolivianos:</label>
                        <input type="text" value="${giro.debitante.importeTotalBs.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>IMPORTE A DEBITAR EN Bs.:</label>
                        <input type="text" value="${giro.debitante.importeTotalBs.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"></div>
                    <div class="form-group">
                        <label>Total Dólares:</label>
                        <input type="text" value="${giro.debitante.totalBolivianos.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Total Comisiones:</label>
                        <input type="text" value="${giro.debitante.totalComisiones.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Total I.T.F.:</label>
                        <input type="text" value="${giro.debitante.totalITF.toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Importe Total Dólares:</label>
                        <input type="text" value="${(giro.debitante.importeTotalBs / 7).toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>IMPORTE A DEBITAR EN $us:</label>
                        <input type="text" value="${(giro.debitante.importeTotalBs / 7).toFixed(2)}" readonly style="background: #e9ecef;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Factura a Favor de:</label>
                        <input type="text" id="debitanteFacturaFavor" value="${giro.debitante.facturaFavor}" ${showEditField}>
                    </div>
                    <div class="form-group">
                        <label>Correo Electrónico:</label>
                        <input type="text" id="debitanteCorreoElectronico" value="${giro.debitante.correoElectronico}" ${showEditField}>
                    </div>
                    <div class="form-group">
                        <label>N.I.T.:</label>
                        <input type="text" id="debitanteNit" value="${giro.debitante.nit}" ${showEditField}>
                    </div>
                    <div class="form-group">
                        <label>.</label>
                        <button id="buttonEditarDatosFactura" class="btn btn-sm btn-warning ${hiddenButton}" style="width: 20%;" onclick="editarDatosFacturaDebitante(${giroId},'edit')" title="Editar Datos de Factura">✏️</button>
                        <button id="buttonGuardarDatosFactura" class="btn btn-sm btn-success ${hiddenButton} hidden-row" style="width: 20%;" onclick="editarDatosFacturaDebitante(${giroId},'save')" title="Guardar Datos de Factura">💾</button>
                        <button id="buttonCancelarEditarDatosFactura" class="btn btn-sm btn-info ${hiddenButton} hidden-row" style="width: 20%;" onclick="editarDatosFacturaDebitante(${giroId},'cancel')" title="Cancelar Editar Datos de Factura">✗</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Concepto Envío de Giro:</label>
                    <textarea rows="2"  ${showReadonly}>${giro.debitante.conceptoEnvio}</textarea>
                </div>
                ${giro.motivoRechazo? `
                <div class="form-group">
                    <label>Motivo de Rechazo de Envío de Giro:</label>
                    <textarea rows="2"  ${showReadonly}>Fecha: ${giro.fechaRechazo} \nMotivo: ${giro.motivoRechazo}</textarea>
                </div>` : ''}

                <!-- Sección de Autorizador -->
                ${ true ? `
                <!-- <div class="autorizador-section" style="margin-top: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;"> -->
                    <div class="form-row" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div class="form-group" style="margin: 0; flex: 1;">
                            <label>${isCreate || isEdit ? '.' : '.'}</label>
                            ${isCreate || isEdit ? `<button class="btn btn-warning" onclick="asignarAutorizador('${mode}',${giroId},'${operation}')">👤 Asignar Autorizador (Control Dual)</button>`:`<label style="text-align:center">Autorizador Asignado: </label>`}
                        </div>
                        <div class="form-group" style="margin: 0; flex: 1;">
                            <label>Usuario:</label>
                            <input type="text" id="autorizadorUsuario" value="${giro.autorizadorUsuario || ''}" readonly>
                        </div>
                        <div class="form-group" style="margin: 0; flex: 2;">
                            <label>Nombre Completo:</label>
                            <input type="text" id="autorizadorNombre" value="${giro.autorizadorNombre || ''}" readonly>
                        </div>
                        <div class="form-group" style="margin: 0; flex: 1;">
                            <label>Cargo:</label>
                            <input type="text" id="autorizadorCargo" value="${giro.autorizadorCargo || ''}" readonly>
                        </div>
                    </div>
                <!-- </div> -->
                `:''}

            </div>


            <div class="tab-section-header" id="" onclick="mostrarOcultarForm('beneficiarios-section')">
                <h3> Datos de los Beneficiarios</h3>
                <span class="panel-2-toggle collapsed" id="panel2Toggle-beneficiarios-section">▼</span>
            </div>
            <!-- Tabla de Beneficiarios -->
            <div class="beneficiarios-section" id="beneficiarios-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <h4 style="color: #2a5298; margin: 0;">👥 Detalle de Giros a Enviar</h4>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="text" id="tableBeneficiariosSearch" placeholder="Buscar beneficiarios..." style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;" onkeyup="filterBeneficiariosTable(${giroId})">
                        <button class="btn btn-sm btn-secondary" onclick="clearBeneficiariosSearch(${giroId})">🗑️</button>
                    </div>
                    ${ (isCreate || isEdit) && tipoRegistro !== 'archivo' ? '<button class="btn btn-success btn-sm" onclick="agregarBeneficiario()">➕ Agregar Beneficiario</button>' : ''}
                </div>
                
                <div id="beneficiariosAutorizacionTable" style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                    <!-- Tabla será generada dinámicamente -->
                </div>
            </div>



            <div class="tab-section-header" id="" onclick="mostrarOcultarForm('form-section-tr')">
                <h3> Trazabilidad</h3>
                <span class="panel-2-toggle collapsed" id="panel2Toggle-beneficiarios-section">▼</span>
            </div>
            <div class="form-section form-section-content" id="form-section-tr" style="margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
                <div class="form-row">
                    <div class="form-group">
                        <label>Datos Solicitud:</label>
                        <textarea rows="5" readonly>Fecha: ${giro.fechaSolicitud} \nMotivo: ${giro.debitante.conceptoEnvio}\nUsuario: ${giro.usuario} \nSucursal: ${giro.oficinaSolicitante} \nRegional: ${giro.regional} </textarea>
                    </div>
                    <div class="form-group">
                        <label>Datos Aprobador:</label>
                        <textarea rows="5" readonly>Fecha: ${giro.fechaAprobacion || ''} \nMotivo: ${giro.motivoAprobacion || ''}\nUsuario: ${giro.autorizadorUsuario || ''} \nSucursal: ${giro.autorizadorSucursal || ''} \nRegional: ${giro.autorizadorRegional || ''} </textarea>
                    </div>
                    <div class="form-group">
                        <label>Datos Rechazo:</label>
                        <textarea rows="5" readonly>Fecha: ${giro.fechaRechazo || ''} \nMotivo: ${giro.motivoRechazo || ''}\nUsuario: ${giro.autorizadorUsuario || ''} \nSucursal: ${giro.autorizadorSucursal || ''} \nRegional: ${giro.autorizadorRegional || ''} </textarea>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('#modal-body').html(modalBody);

    $('#modal-footer').html(`
        <button class="btn btn-success ${ isCreate || isEdit ? '': ' hidden-row'}" onclick="enviarSolicitudGiro('${tipo}',${giroId},'${mode}')">💾 Guardar y Enviar Solicitud de Giro</button>
        <button class="btn btn-warning ${ isPrint ? '': ' hidden-row'}" onclick="window.print()">📤 Imprimir Solicitud</button>
        <button class="btn btn-success ${hiddenButton}" onclick="aprobarSolicitudGiro(${giroId},'${operation}','aprobar')" style="padding: 12px 30px;">✅ Aprobar Solicitud</button>
        <button class="btn btn-danger ${hiddenButton}" onclick="aprobarSolicitudGiro(${giroId},'${operation}', 'rechazar')" style="padding: 12px 30px;">✗ Rechazar Solicitud</button>
        <button class="btn btn-secondary" onclick="closeModal()" style="padding: 12px 30px;">Cancelar</button>
    `);

    // Generate beneficiarios table
    generateBeneficiariosAutorizacionTable(mode,giro,operation);

    $('#modal').show();
    isPrint ? window.print() : null;
};



window.buscarCuentaDebitar = function() {
    
    ////var giro = girosAutorizacionData[2] ? girosAutorizacionData[2] : [];

    //$('#debitanteCuentaDebitar').val(autorizador.usuario);
    //$('#autorizadorNombre').val(autorizador.nombreCompleto);
    //$('#autorizadorCargo').val(autorizador.cargo);

    const searchTerm = $('#debitanteCuentaDebitar').val().toLowerCase();
    const operacionSeleccionada = JSON.parse(localStorage.getItem('operacionSeleccionada') || {});
    const operation = operacionSeleccionada.operacion;
    const mode = operacionSeleccionada.mode;

    if(searchTerm.length > 4){
        var giroIndex = girosAutorizacionData.findIndex(g => g.nroCuenta.includes(searchTerm));

        if (giroIndex === -1) {
            giroIndex = 3;
        }
            const giro = girosAutorizacionData[giroIndex];
            $('#debitanteCuentaDebitar').val(giro.nroCuenta);
            $('#debitanteRazonSocial').val(giro.debitante.razonSocial);
            $('#debitanteSaldoDisponible').val(giro.debitante.saldoDisponible);
            $('#debitanteProducto').val(giro.debitante.producto);
            $('#debitanteEstadoCuenta').val(giro.debitante.estadoCuenta);
            //$('#debitanteTotalBolivianos').val(giro.totalBolivianos);
            //$('#debitanteTotalComisiones').val(giro.totalComisiones);
            //$('#debitanteTotalDolares').val(giro.totalDolares);
            //$('#debitanteTotalComisionesDolares').val(giro.totalComisionesDolares);
            //$('#debitanteTotalITF').val(giro.totalITF);
            //$('#debitanteImporteTotalBs').val(giro.importeTotalBs);
            $('#debitanteFacturaFavor').val(giro.debitante.facturaFavor);
            $('#debitanteCorreoElectronico').val(giro.debitante.correoElectronico);
            $('#debitanteNit').val(giro.debitante.nit);
            //$('#debitanteConceptoEnvio').val(giro.conceptoEnvio);

            //closeModal();
            //tipoRegistro = 'otro';
            //openAutorizacionModal('create',giroIndex, 'Solicitudes');

            generateBeneficiariosAutorizacionTable(mode,giro,operation);
        //}
    }
    
    

    /*
    filteredBeneficiariosData = girosAutorizacionData.filter(ben => {
        return searchTerm === '' || 
            ben.regional.toLowerCase().includes(searchTerm) ||
            ben.nroDoc.toLowerCase().includes(searchTerm) ||
            ben.beneficiario.toLowerCase().includes(searchTerm) ||
            ben.direccion.toLowerCase().includes(searchTerm) ||
            ben.telefono.includes(searchTerm) ||
            ben.correo.toLowerCase().includes(searchTerm);
    });*/



   

    //}, 100);
    

};


// Variables for beneficiarios authorization
let currentBeneficiariosData = [];
let filteredBeneficiariosData = [];
let currentBeneficiariosPage = 1;
let beneficiariosItemsPerPage = 10;

// Generate beneficiarios authorization table
function generateBeneficiariosAutorizacionTable(mode,giro,operation) {
    currentBeneficiariosData = giro.beneficiarios;
    filteredBeneficiariosData = [...currentBeneficiariosData];
    renderBeneficiariosAutorizacionTable(mode,operation);
}

// Render beneficiarios authorization table
function renderBeneficiariosAutorizacionTable(mode,operation) {

    const isView = mode === 'view';
    const isEdit = mode === 'edit';
    const isCreate = mode === 'create';
    const isAutorize = mode === 'autorize';
    const isPrint = mode === 'print';


    const startIndex = (currentBeneficiariosPage - 1) * beneficiariosItemsPerPage;
    const endIndex = startIndex + beneficiariosItemsPerPage;
    const pageData = filteredBeneficiariosData.slice(startIndex, endIndex);
    const hiddenButton = operation === 'Autorización' && !isView? '' : operation === 'Solicitudes' && (isCreate || isEdit)? '' : ' hidden-row';

    const isShowEdit = (isEdit || isAutorize ); // && tipoRegistro == 'archivo';

    

    let tableHTML = `
        <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa;">
            <span>Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredBeneficiariosData.length)} de ${filteredBeneficiariosData.length} beneficiarios</span>
        </div>
        <table class="data-table" style="font-size: 12px;" id="tablaBeneficiarios">
            <thead>
                <tr>
                    <th>Regional</th>
                    <th>No.Doc.Identificación</th>
                    <th>Beneficiario del Giro</th>
                    <th>Moneda</th>
                    <th>Importe a Enviar</th>
                    <th>Comisión</th>
                    <th>Cobrar Com.</th>
                    <th>I.T.F.</th>
                    <th>Importe Enviado</th>
                    <th>Dirección Beneficiario</th>
                    <th>Teléfono</th>
                    <th>Correo Electrónico</th>
                    <th>Estado</th>
                    <th class="${hiddenButton}">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageData.forEach(ben => {
        const statusClass = getStatusClass(ben.estado);
        tableHTML += `
            <tr>
                <td>${ben.regional}</td>
                <td>${ben.nroDoc}</td>
                <td>${ben.beneficiario}</td>
                <td>${ben.moneda}</td>
                <td>${ben.importeEnviar.toFixed(2)}</td>
                <td>${ben.comision.toFixed(2)}</td>
                <td>${ben.cobrarCom}</td>
                <td>${ben.itf.toFixed(2)}</td>
                <td>${ben.importeEnviado.toFixed(2)}</td>
                <td>${ben.direccion}</td>
                <td>${ben.telefono}</td>
                <td>${ben.correo}</td>
                <td><span class="status-badge ${statusClass}">${ben.estado}</span></td>
                <td class="${hiddenButton}">
                    <div style="display: flex; gap: 5px;">
                        ${ isShowEdit? `
                            <button class="btn btn-sm btn-success ${hiddenButton}" onclick="aprobarBeneficiarioIndividual(${ben.id},'${mode},'${operation}')" title="Aprobar" ${ben.estado === 'Aprobado' ? 'disabled' : ''}>✓</button>
                        <button class="btn btn-sm btn-danger ${hiddenButton}" onclick="rechazarBeneficiarioIndividual(${ben.id},'${mode}','${operation}')" title="Rechazar" ${ben.estado === 'Rechazado' ? 'disabled' : ''}>✗</button>
                            `: `<button class="btn btn-sm btn-warning" onclick="editarBeneficiario(${ben.id})" title="Editar">✏️</button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarBeneficiario(${ben.id})" title="Eliminar">🗑️</button>`}
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    // Add pagination for beneficiarios
    tableHTML += renderBeneficiariosAutorizacionPagination();

    // Add summary
    tableHTML += `
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Cantidad de Registros:</strong> ${filteredBeneficiariosData.length}</span>
                <span><strong>Total Bolivianos:</strong> ${filteredBeneficiariosData.reduce((sum, b) => sum + b.importeEnviar, 0).toFixed(2)}</span>
                <span><strong>Total Comisiones:</strong> ${filteredBeneficiariosData.reduce((sum, b) => sum + b.comision, 0).toFixed(2)}</span>
            </div>
        </div>
    `;

    $('#beneficiariosAutorizacionTable').html(tableHTML);
}

// Render pagination for beneficiarios authorization
function renderBeneficiariosAutorizacionPagination() {
    const totalPages = Math.ceil(filteredBeneficiariosData.length / beneficiariosItemsPerPage);
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination" style="margin-top: 15px;">';
    
    // Previous button
    paginationHTML += `<button onclick="changeBeneficiariosPage(${currentBeneficiariosPage - 1})" ${currentBeneficiariosPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentBeneficiariosPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="changeBeneficiariosPage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    paginationHTML += `<button onclick="changeBeneficiariosPage(${currentBeneficiariosPage + 1})" ${currentBeneficiariosPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;
    
    paginationHTML += '</div>';
    return paginationHTML;
}

// Change page for beneficiarios
window.changeBeneficiariosPage = function(page) {
    const totalPages = Math.ceil(filteredBeneficiariosData.length / beneficiariosItemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentBeneficiariosPage = page;
        renderBeneficiariosAutorizacionTable();
    }
};

// Filter beneficiarios table
window.filterBeneficiariosTable = function(giroId) {
    const searchTerm = $('#tableBeneficiariosSearch').val().toLowerCase();
    
    filteredBeneficiariosData = currentBeneficiariosData.filter(ben => {
        return searchTerm === '' || 
            ben.regional.toLowerCase().includes(searchTerm) ||
            ben.nroDoc.toLowerCase().includes(searchTerm) ||
            ben.beneficiario.toLowerCase().includes(searchTerm) ||
            ben.direccion.toLowerCase().includes(searchTerm) ||
            ben.telefono.includes(searchTerm) ||
            ben.correo.toLowerCase().includes(searchTerm);
    });
    
    currentBeneficiariosPage = 1;
    renderBeneficiariosAutorizacionTable();
};

// Clear beneficiarios search
window.clearBeneficiariosSearch = function(giroId) {
    $('#tableBeneficiariosSearch').val('');
    filterBeneficiariosTable(giroId);
};

// Aprobar beneficiario individual
window.aprobarBeneficiarioIndividual = function(beneficiarioId, mode, operation='Solicitudes') {
    // Find and update beneficiario status
    const beneficiario = currentBeneficiariosData.find(b => b.id === beneficiarioId);
    if (beneficiario) {
        beneficiario.estado = 'Aprobado';
        renderBeneficiariosAutorizacionTable(mode,operation);
        showAlert(`Beneficiario ${beneficiario.beneficiario} aprobado.`, 'success');
    }
};

// Rechazar beneficiario individual
window.rechazarBeneficiarioIndividual = function(beneficiarioId, mode, operation='Solicitudes') {
    const beneficiario = currentBeneficiariosData.find(b => b.id === beneficiarioId);
    if (beneficiario) {
        // Show prompt for rejection reason
        const motivo = prompt('Ingrese el motivo del rechazo:');
        if (motivo && motivo.trim() !== '') {
            beneficiario.estado = 'Rechazado';
            beneficiario.motivoRechazo = motivo;
            renderBeneficiariosAutorizacionTable(mode,operation);
            showAlert(`Beneficiario ${beneficiario.beneficiario} rechazado. Motivo: ${motivo}`, 'warning');
        }
    }
};

// Aprobar solicitud de giro
window.aprobarSolicitudGiro = function(giroId,operation, action) {

    const actionEstado = action === 'aprobar' ? 'APROBADO' : 'RECHAZADO';
    const actionText = action === 'aprobar' ? 'APROBAR' : 'RECHAZAR';
    showConfirmModal(
        'Confirmar operaciones',
        '¿Está seguro de '+actionText+' la solicitud de Giros Nacional?',
        () => {
            // Update giro status
            const allGiros = JSON.parse(localStorage.getItem('girosAutorizacion') || '[]');
            const giroIndex = allGiros.findIndex(g => g.id === giroId);
            
            if (giroIndex !== -1) {

                if( action === 'rechazar') {

                            // Show prompt for rejection reason
                    const motivo = prompt('Ingrese el motivo del rechazo:');
                    if (motivo && motivo.trim() !== '') {
                        allGiros[giroIndex].estado = actionEstado; 
                        allGiros[giroIndex].motivoRechazo = motivo; 
                    }



                }


                allGiros[giroIndex].estado = actionEstado; //'APROBADO';
                action === 'aprobar' ? allGiros[giroIndex].beneficiarios = filteredBeneficiariosData: allGiros[giroIndex].beneficiarios.forEach(b => b.estado = 'Rechazado');
                action === 'aprobar' ? allGiros[giroIndex].fechaAprobacion = new Date().toISOString().split('T')[0] : allGiros[giroIndex].fechaRechazo = new Date().toISOString().split('T')[0];
                localStorage.setItem('girosAutorizacion', JSON.stringify(allGiros));
                
                closeModal('-confirm');
                closeModal();
                loadGirosAutorizacionData(operation);
                showAlert('Solicitud de Giro Nacional '+actionEstado+' exitosamente.', 'success');
            }
        }
    );
    $('.modal-content-confirm').removeClass('fullscreen');
};

window.mostrarOcultarForm = function(divId) {
    console.log(divId);
    $('#'+divId).toggleClass('collapsed');
    $('#panel2Toggle-'+divId).toggleClass('collapsed');
};



 // Panel 2 toggle functionality
 /*$('#formDatosCliente').click(function() {

    console.log('formDatosCliente');
    $('#form-section-gn').toggleClass('collapsed');
    $('#panel2Toggle').toggleClass('collapsed');
});*/


/*************************************************************************** */

            // Initialize Giros Reportes data
            if (!localStorage.getItem('girosReportes')) {
                const girosReportesData = [
                    {
                        id: 1,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'NHISANCA',
                        identificacionPersonal: '6952164 LP',
                        nombresApellidos: 'ANTONIETA PINTO ANTEQUERA',
                        monto: 1500.00,
                        comision: 35.00,
                        itf: 0.00,
                        destino: 'SUCRE',
                        numeroGiro: '1259802',
                        estado: 'PENDIENTE',
                        usuarioPago: '',
                        cobradoAgencia: '',
                        fechaPago: ''
                    },
                    {
                        id: 2,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'NHISANCA',
                        identificacionPersonal: '8745235 SC',
                        nombresApellidos: 'JABILLO ATARÉ REINALDO',
                        monto: 1025.00,
                        comision: 35.00,
                        itf: 0.00,
                        destino: 'COCHABAMBA',
                        numeroGiro: '1259803',
                        estado: 'PAGADO',
                        usuarioPago: 'CAJILLOA',
                        cobradoAgencia: '155 AG. CHIMÓRE - CBBA',
                        fechaPago: '06/07/2019'
                    },
                    {
                        id: 3,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'NHISANCA',
                        identificacionPersonal: '5846316 BJ OR',
                        nombresApellidos: 'SERVICIO ARANCIBIA GUILVER',
                        monto: 1354.00,
                        comision: 60.74,
                        itf: 0.00,
                        destino: 'ORURO',
                        numeroGiro: '1259804',
                        estado: 'REVERTIDO',
                        usuarioPago: 'EVENENO',
                        cobradoAgencia: '41 AG. NORTE - ORURO',
                        fechaPago: '06/07/2019'
                    },
                    {
                        id: 4,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'LCABRASCO',
                        identificacionPersonal: '5906158 SC LP',
                        nombresApellidos: 'TEODORA FUENTES GABRIEL',
                        monto: 1350.00,
                        comision: 71.38,
                        itf: 0.00,
                        destino: 'POTOSI',
                        numeroGiro: '1259805',
                        estado: 'VENCIDO',
                        usuarioPago: '',
                        cobradoAgencia: '',
                        fechaPago: ''
                    },
                    {
                        id: 5,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'LCABRASCO',
                        identificacionPersonal: '9861236 GH OR',
                        nombresApellidos: 'VILLA IMPERIAL INDUSTRIAL SRL',
                        monto: 2000.35,
                        comision: 60.01,
                        itf: 0.00,
                        destino: 'TARIJA',
                        numeroGiro: '1259806',
                        estado: 'PENDIENTE',
                        usuarioPago: '',
                        cobradoAgencia: '',
                        fechaPago: ''
                    },
                    {
                        id: 6,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'LCABRASCO',
                        identificacionPersonal: '5846262 SC',
                        nombresApellidos: 'JAVIER SULLANCO',
                        monto: 5696.56,
                        comision: 55.59,
                        itf: 0.00,
                        destino: 'PANDO',
                        numeroGiro: '1259807',
                        estado: 'PAGADO',
                        usuarioPago: 'MIFERES',
                        cobradoAgencia: '184 AG. PUERTO RICO - PDO',
                        fechaPago: '06/07/2019'
                    },
                    {
                        id: 7,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'BOLIVIANOS',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'LCABRASCO',
                        identificacionPersonal: '4821267 GH',
                        nombresApellidos: 'VICTOR DANIEL ORTEGA',
                        monto: 3450.89,
                        comision: 89.66,
                        itf: 0.00,
                        destino: 'BENI',
                        numeroGiro: '1259808',
                        estado: 'REVERTIDO',
                        usuarioPago: 'CVILEES',
                        cobradoAgencia: '127 AG. RIBERALTA/DE - BENI',
                        fechaPago: '06/07/2019'
                    },
                    {
                        id: 8,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'DOLARES',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'JALOPEZ',
                        identificacionPersonal: '6952448 PO',
                        nombresApellidos: 'JAVIER QUISPE',
                        monto: 789.99,
                        comision: 35.00,
                        itf: 2.44,
                        destino: 'TARIJA',
                        numeroGiro: '1259809',
                        estado: 'PENDIENTE',
                        usuarioPago: '',
                        cobradoAgencia: '',
                        fechaPago: ''
                    },
                    {
                        id: 9,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'DOLARES',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'JALOPEZ',
                        identificacionPersonal: '8959667 SI PA',
                        nombresApellidos: 'JOHNNY ZALLES JOVE',
                        monto: 650.00,
                        comision: 35.00,
                        itf: 1.98,
                        destino: 'BENI',
                        numeroGiro: '1259810',
                        estado: 'PAGADO',
                        usuarioPago: 'AMEDINA1',
                        cobradoAgencia: '260 AG. POMPEYA - BENI',
                        fechaPago: '06/07/2019'
                    },
                    {
                        id: 10,
                        cuentaDebitada: '10002027020200',
                        detalle: 'COMPAÑÍA INDUSTRIAL DE TABACOS S.A.',
                        moneda: 'DOLARES',
                        fechaEnvio: '06/07/2019',
                        usuarioRegistro: 'ASAMIENTO',
                        identificacionPersonal: '8956657 PA',
                        nombresApellidos: 'TORRICO ROJAS CECILIA',
                        monto: 4325.00,
                        comision: 56.5,
                        itf: 13.11,
                        destino: 'BENI',
                        numeroGiro: '1259811',
                        estado: 'REVERTIDO',
                        usuarioPago: 'MGUTIERRE',
                        cobradoAgencia: '256 AG. SAN JOAQUIN',
                        fechaPago: '06/07/2019'
                    }
                ];
                localStorage.setItem('girosReportes', JSON.stringify(girosReportesData));
            }

            // Load Giros Reportes CRUD
            function loadGirosReportesCRUD() {
                // Panel 2 - Search/Filter
                $('#panel2Content').html(`
                    <form class="search-form" id="searchReportesForm">
                        <div class="form-group">
                            <label>Regional:</label>
                            <select id="searchReporteRegional">
                                <option value="">Todos</option>
                                <option value="LA PAZ">LA PAZ</option>
                                <option value="SANTA CRUZ">SANTA CRUZ</option>
                                <option value="COCHABAMBA">COCHABAMBA</option>
                                <option value="SUCRE">SUCRE</option>
                                <option value="POTOSI">POTOSI</option>
                                <option value="TARIJA">TARIJA</option>
                                <option value="BENI">BENI</option>
                                <option value="PANDO">PANDO</option>
                                <option value="ORURO">ORURO</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Fecha Inicio:</label>
                            <input type="date" id="searchReporteFechaInicio" value="2019-07-02">
                        </div>
                        <div class="form-group">
                            <label>Fecha Final:</label>
                            <input type="date" id="searchReporteFechaFinal" value="2019-07-30">
                        </div>
                        <div class="form-group">
                            <label>Cuenta Debitante:</label>
                            <input type="text" id="searchReporteCuentaDebitante" placeholder="10002027020200">
                        </div>
                        <div class="form-group">
                            <label>Estado:</label>
                            <select id="searchReporteEstado">
                                <option value="">Todos los estados</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="PAGADO">Pagado</option>
                                <option value="VENCIDO">Vencido</option>
                                <option value="REVERTIDO">Revertido</option>
                            </select>
                        </div>
                        <div class="search-actions">
                            <button type="button" class="btn btn-primary" onclick="searchGirosReportes()">🔍 Generar Reporte</button>
                            <button type="button" class="btn btn-secondary" onclick="clearSearchReportes()">🗑️ Limpiar</button>
                        </div>
                    </form>
                `);

                // Panel 3 - Data List
                $('#panel3Title').text('📊 Reporte de Envío de Giros Masivos');
                $('#panel3Actions').html(`
                    <button class="btn btn-info" onclick="printReport('imprimir-reporte')">🖨️ Imprimir</button>
                    <button class="btn btn-success" onclick="exportReportData()">📊 Exportar</button>
                    <button class="btn btn-secondary" onclick="refreshReportData()">🔄 Actualizar</button>
                `);

                // Load initial report data
                loadGirosReportesData();
            }

            // Variables for reports
            let currentReportData = [];
            let filteredReportData = [];
            let currentReportPage = 1;
            let reportItemsPerPage = 10;

            // Load giros reportes data
            function loadGirosReportesData() {
                currentReportData = JSON.parse(localStorage.getItem('girosReportes') || '[]');
                filteredReportData = [...currentReportData];
                renderGirosReportesTable();
            }

            // Render giros reportes table
            function renderGirosReportesTable() {
                const startIndex = (currentReportPage - 1) * reportItemsPerPage;
                const endIndex = startIndex + reportItemsPerPage;
                const pageData = filteredReportData.slice(startIndex, endIndex);

                // Get date range for header
                const fechaInicio = $('#searchReporteFechaInicio').val() || '02/07/2019';
                const fechaFinal = $('#searchReporteFechaFinal').val() || '03/07/2019';

                let tableHTML = `
                    <div class="report-header">
                        <div class="report-title">REPORTE PARA GIROS MASIVOS</div>
                        <div class="report-date-range">DEL ${fechaInicio.split('-').reverse().join('/')} AL ${fechaFinal.split('-').reverse().join('/')}</div>
                    </div>
                    
                    <div class="table-header-tools" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span>Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredReportData.length)} de ${filteredReportData.length} registros</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="text" id="tableSearchReportes" placeholder="Buscar en reporte..." style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;" onkeyup="filterReportesTable()">
                            <button class="btn btn-sm btn-secondary" onclick="clearTableSearchReportes()">🗑️</button>
                        </div>
                    </div>
                    
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>CUENTA DEBITADA</th>
                                <th>DETALLE</th>
                                <th>MONEDA</th>
                                <th>FECHA DE ENVÍO</th>
                                <th>USUARIO QUE REGISTRÓ EL GIRO</th>
                                <th>IDENTIFICACIÓN PERSONAL</th>
                                <th>NOMBRES Y APELLIDOS</th>
                                <th>MONTO</th>
                                <th>COMISIÓN</th>
                                <th>ITF</th>
                                <th>DESTINO</th>
                                <th>N° de GIRO</th>
                                <th>ESTADO</th>
                                <th>USUARIO QUE PAGÓ</th>
                                <th>COBRADO EN AGENCIA</th>
                                <th>FECHA DE PAGO</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                pageData.forEach(reporte => {
                    const statusClass = getStatusClass(reporte.estado);
                    tableHTML += `
                        <tr>
                            <td>${reporte.cuentaDebitada}</td>
                            <td>${reporte.detalle}</td>
                            <td>${reporte.moneda}</td>
                            <td>${reporte.fechaEnvio}</td>
                            <td>${reporte.usuarioRegistro}</td>
                            <td>${reporte.identificacionPersonal}</td>
                            <td>${reporte.nombresApellidos}</td>
                            <td>${reporte.monto.toFixed(2)}</td>
                            <td>${reporte.comision.toFixed(2)}</td>
                            <td>${reporte.itf.toFixed(2)}</td>
                            <td>${reporte.destino}</td>
                            <td>${reporte.numeroGiro}</td>
                            <td><span class="status-badge ${statusClass}">${reporte.estado}</span></td>
                            <td>${reporte.usuarioPago}</td>
                            <td>${reporte.cobradoAgencia}</td>
                            <td>${reporte.fechaPago}</td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                // Add pagination
                tableHTML += renderReportesPagination();

                // Add summary
                const totalMonto = filteredReportData.reduce((sum, r) => sum + r.monto, 0);
                const totalComision = filteredReportData.reduce((sum, r) => sum + r.comision, 0);
                const totalITF = filteredReportData.reduce((sum, r) => sum + r.itf, 0);

                tableHTML += `
                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span><strong>Total Registros:</strong> ${filteredReportData.length}</span>
                            <span><strong>Total Monto:</strong> ${totalMonto.toFixed(2)}</span>
                            <span><strong>Total Comisión:</strong> ${totalComision.toFixed(2)}</span>
                            <span><strong>Total ITF:</strong> ${totalITF.toFixed(2)}</span>
                        </div>
                    </div>
                `;

                $('#content-panel-3').html(tableHTML);
            }

            // Render pagination for reportes
            function renderReportesPagination() {
                const totalPages = Math.ceil(filteredReportData.length / reportItemsPerPage);
                if (totalPages <= 1) return '';

                let paginationHTML = '<div class="pagination">';
                
                // Previous button
                paginationHTML += `<button onclick="changeReportePage(${currentReportPage - 1})" ${currentReportPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
                
                // Page numbers
                for (let i = 1; i <= totalPages; i++) {
                    if (i === currentReportPage) {
                        paginationHTML += `<button class="active">${i}</button>`;
                    } else if (i === 1 || i === totalPages || (i >= currentReportPage - 2 && i <= currentReportPage + 2)) {
                        paginationHTML += `<button onclick="changeReportePage(${i})">${i}</button>`;
                    } else if (i === currentReportPage - 3 || i === currentReportPage + 3) {
                        paginationHTML += `<span>...</span>`;
                    }
                }
                
                // Next button
                paginationHTML += `<button onclick="changeReportePage(${currentReportPage + 1})" ${currentReportPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;
                
                paginationHTML += '</div>';
                return paginationHTML;
            }

            // Change page for reportes
            window.changeReportePage = function(page) {
                const totalPages = Math.ceil(filteredReportData.length / reportItemsPerPage);
                if (page >= 1 && page <= totalPages) {
                    currentReportPage = page;
                    renderGirosReportesTable();
                }
            };

            // Filter table search for reportes
            window.filterReportesTable = function() {
                const searchTerm = $('#tableSearchReportes').val().toLowerCase();
                
                filteredReportData = currentReportData.filter(reporte => {
                    return searchTerm === '' || 
                        reporte.cuentaDebitada.includes(searchTerm) ||
                        reporte.detalle.toLowerCase().includes(searchTerm) ||
                        reporte.usuarioRegistro.toLowerCase().includes(searchTerm) ||
                        reporte.nombresApellidos.toLowerCase().includes(searchTerm) ||
                        reporte.destino.toLowerCase().includes(searchTerm) ||
                        reporte.numeroGiro.includes(searchTerm) ||
                        reporte.estado.toLowerCase().includes(searchTerm);
                });
                
                currentReportPage = 1;
                renderGirosReportesTable();
            };

            // Clear table search for reportes
            window.clearTableSearchReportes = function() {
                $('#tableSearchReportes').val('');
                filterReportesTable();
            };

            // Search giros reportes
            window.searchGirosReportes = function() {
                const regional = $('#searchReporteRegional').val();
                const fechaInicio = $('#searchReporteFechaInicio').val();
                const fechaFinal = $('#searchReporteFechaFinal').val();
                const cuenta = $('#searchReporteCuentaDebitante').val().toLowerCase();
                const estado = $('#searchReporteEstado').val();

                if (!fechaInicio || !fechaFinal) {
                    showAlert('Por favor seleccione el rango de fechas.', 'warning');
                    return;
                }

                // Convert dates for comparison
                const fechaInicioFormatted = fechaInicio.split('-').reverse().join('/');
                const fechaFinalFormatted = fechaFinal.split('-').reverse().join('/');

                /*
                filteredReportData = currentReportData.filter(reporte => {
                    return reporte.fechaEnvio >= fechaInicioFormatted && reporte.fechaEnvio <= fechaFinalFormatted;
                });*/


                filteredReportData = currentReportData.filter(reporte => {
                    let matches = true;
                    
                    if (regional && reporte.destino !== regional) matches = false;
                    if (cuenta && !reporte.cuentaDebitada.includes(cuenta)) matches = false;
                    if (estado && reporte.estado !== estado) matches = false;
                    if (fechaInicioFormatted && reporte.fechaEnvio < fechaInicioFormatted) matches = false;
                    if (fechaFinalFormatted && reporte.fechaEnvio > fechaFinalFormatted) matches = false;
                    
                    return matches;
                });



                currentReportPage = 1;
                renderGirosReportesTable();
                showAlert('Reporte generado. ' + filteredReportData.length + ' registros encontrados.', 'info');
            };

            // Clear search reportes
            window.clearSearchReportes = function() {
                $('#searchReportesForm')[0].reset();
                $('#searchReporteFechaInicio').val('2019-07-02');
                $('#searchReporteFechaFinal').val('2019-07-03');
                loadGirosReportesData();
                showAlert('Filtros limpiados.', 'info');
            };

            // Print report
            window.printReport = function(modo = "imprimir-ventana") {

                if (modo === 'imprimir-reporte') {
                     // $('#panel3Title').attr('style', 'display: none !important;');
                    $('.panel-3-header').attr('style', 'display: none !important;');
                    //$('table.data-table > thead > tr > th:last-of-type').removeAttr('style');
                    //$('table.data-table > thead > tr > td:last-of-type').removeAttr('style');
                    window.print();
                    $('.panel-3-header').attr('style', 'display: inherit;');
                    $('#panel3Title').attr('style', 'display: inherit;');
                }else if (modo === 'imprimir-ventana') {
                    // $('#panel3Title').attr('style', 'display: none !important;');
                   //$('.panel-3-header').attr('style', 'display: none !important;');
                   $('table.data-table > thead > tr > th:last-of-type').attr('style', 'display: none !important;');
                   $('table.data-table > tbody > tr > td:last-of-type').attr('style', 'display: none !important;');
                   window.print();
                   $('table.data-table > thead > tr > th:last-of-type').removeAttr('style');
                   $('table.data-table > tbody > tr > td:last-of-type').removeAttr('style');
                   //$('.panel-3-header').attr('style', 'display: inherit;');
                   //$('#panel3Title').attr('style', 'display: inherit;');
               }
            };


            // Export report data
            window.exportReportData = function() {
                const headers = ['CUENTA DEBITADA', 'DETALLE', 'MONEDA', 'FECHA DE ENVÍO', 'USUARIO QUE REGISTRÓ EL GIRO', 'IDENTIFICACIÓN PERSONAL', 'NOMBRES Y APELLIDOS', 'MONTO', 'COMISIÓN', 'ITF', 'DESTINO', 'N° de GIRO', 'ESTADO', 'USUARIO QUE PAGÓ', 'COBRADO EN AGENCIA', 'FECHA DE PAGO'];
                let csv = headers.join(',') + '\n';
                
                filteredReportData.forEach(row => {
                    const values = [
                        row.cuentaDebitada,
                        row.detalle,
                        row.moneda,
                        row.fechaEnvio,
                        row.usuarioRegistro,
                        row.identificacionPersonal,
                        row.nombresApellidos,
                        row.monto,
                        row.comision,
                        row.itf,
                        row.destino,
                        row.numeroGiro,
                        row.estado,
                        row.usuarioPago,
                        row.cobradoAgencia,
                        row.fechaPago
                    ];
                    csv += values.map(v => `"${v}"`).join(',') + '\n';
                });
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'reporte_giros_masivos.csv';
                a.click();
                window.URL.revokeObjectURL(url);
                
                showAlert('Reporte exportado exitosamente.', 'success');
            };

            // Refresh report data
            window.refreshReportData = function() {
                loadGirosReportesData();
                showAlert('Datos del reporte actualizados.', 'success');
            };





//})