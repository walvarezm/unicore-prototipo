// Add to existing code after initializeChequesGerenciaData()

function loadChequesReversionCRUD() {
    // Panel 2 - Search/Filter
    $('#panel2Content').html(`
        <form class="search-form" id="searchChequesReversionForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Nro. de Cheque:</label>
                    <input type="text" id="searchNroCheque" placeholder="Ingrese número">
                </div>
                <div class="form-group">
                    <label>Estado:</label>
                    <select id="searchEstado">
                        <option value="">Todos</option>
                        <option value="REVERSION_SOLICITADA">REVERSION SOLICITADA</option>
                        <option value="REVERTIDO">REVERTIDO</option>
                    </select>
                </div>
            </div>
            <div class="search-actions">
                <button type="button" class="btn btn-primary" onclick="searchChequesReversion()">🔍 Buscar</button>
                <button type="button" class="btn btn-secondary" onclick="clearSearchChequesReversion()">🗑️ Limpiar</button>
            </div>
        </form>
    `);

    // Panel 3 - Data List
    $('#panel3Title').text('📋 Reversión de Cheques de Gerencia');
    $('#panel3Actions').html(`
        <button class="btn btn-info" onclick="refreshChequesReversionData()">🔄 Actualizar</button>
    `);

    const tableHTML = `
        <div class="table-container">
            <div class="table-header-tools">
                <input type="text" id="tableSearch" placeholder="Buscar en la tabla..." onkeyup="filterTable()">
            </div>
            <div id="chequesReversionTable"></div>
        </div>
    `;

    $('#content-panel-3').html(tableHTML);
    loadChequesReversionData();
}

function loadChequesReversionData() {
    const chequesData = [
        {
            id: 1,
            nroSolicitud: '1234567',
            nroCheque: '145688',
            monto: 100000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'LUIS CARLOS LOPEZ CHOQUE',
            formaPago: 'CUENTA DE EFECTIVO',
            motivoSolicitud: 'SOLICITUD DEL CLIENTE',
            usuarioFirmante1: {
                usuario: 'ALGARCIA',
                nombre: 'ALEJANDRO ERNESTO GARCIA PARRA',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'SVALDA',
                nombre: 'SHIRLEY VALDA MERCADO',
                valor: 'A'
            }
        },
        {
            id: 2,
            nroSolicitud: '1234568',
            nroCheque: '145689',
            monto: 75000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERTIDO',
            beneficiario: 'MARIA ELENA CASTRO MENDOZA',
            formaPago: 'CUENTA CORRIENTE',
            motivoSolicitud: 'ERROR EN MONTO',
            usuarioFirmante1: {
                usuario: 'RVARGAS',
                nombre: 'ROBERTO VARGAS LIMA',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'MROJAS',
                nombre: 'MARTHA ROJAS PEREZ',
                valor: 'A'
            }
        },
        {
            id: 3,
            nroSolicitud: '1234569',
            nroCheque: '145690',
            monto: 250000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'EMPRESA CONSTRUCTORA XYZ S.R.L.',
            formaPago: 'CUENTA DE AHORRO',
            motivoSolicitud: 'PAGO A PROVEEDOR',
            usuarioFirmante1: {
                usuario: 'JPEREZ',
                nombre: 'JUAN PEREZ MARTINEZ',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'CGOMEZ',
                nombre: 'CARLOS GOMEZ SILVA',
                valor: 'A'
            }
        },
        {
            id: 4,
            nroSolicitud: '1234570',
            nroCheque: '145691',
            monto: 180000.00,
            moneda: 'DOLARES',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'IMPORTADORA DELTA LTDA.',
            formaPago: 'CUENTA CORRIENTE',
            motivoSolicitud: 'PAGO IMPORTACION',
            usuarioFirmante1: {
                usuario: 'PALVAREZ',
                nombre: 'PATRICIA ALVAREZ RODRIGUEZ',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'LCRUZ',
                nombre: 'LUIS CRUZ MENDOZA',
                valor: 'A'
            }
        },
        {
            id: 5,
            nroSolicitud: '1234571',
            nroCheque: '145692',
            monto: 95000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERTIDO',
            beneficiario: 'JUAN CARLOS MAMANI QUISPE',
            formaPago: 'CUENTA DE EFECTIVO',
            motivoSolicitud: 'SOLICITUD CLIENTE',
            usuarioFirmante1: {
                usuario: 'DFLORES',
                nombre: 'DANIEL FLORES COPA',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'RCASTRO',
                nombre: 'ROSA CASTRO VILLA',
                valor: 'A'
            }
        },
        {
            id: 6,
            nroSolicitud: '1234572',
            nroCheque: '145693',
            monto: 320000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'CONSTRUCTORA HORIZONTE S.A.',
            formaPago: 'CUENTA CORRIENTE',
            motivoSolicitud: 'PAGO CONTRATO OBRA',
            usuarioFirmante1: {
                usuario: 'MVARGAS',
                nombre: 'MIGUEL VARGAS TORREZ',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'ALOPEZ',
                nombre: 'ANA LOPEZ GARCIA',
                valor: 'A'
            }
        },
        {
            id: 7,
            nroSolicitud: '1234573',
            nroCheque: '145694',
            monto: 150000.00,
            moneda: 'DOLARES',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'COMERCIAL ORIENTE LTDA.',
            formaPago: 'CUENTA DE AHORRO',
            motivoSolicitud: 'PAGO MERCADERIA',
            usuarioFirmante1: {
                usuario: 'FCASTRO',
                nombre: 'FERNANDO CASTRO ROJAS',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'MMENDOZA',
                nombre: 'MONICA MENDOZA PAZ',
                valor: 'A'
            }
        },
        {
            id: 8,
            nroSolicitud: '1234574',
            nroCheque: '145695',
            monto: 85000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERTIDO',
            beneficiario: 'PEDRO PABLO PAREDES LUNA',
            formaPago: 'CUENTA DE EFECTIVO',
            motivoSolicitud: 'ERROR BENEFICIARIO',
            usuarioFirmante1: {
                usuario: 'RMORALES',
                nombre: 'RICARDO MORALES SUAREZ',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'EVALDES',
                nombre: 'ELENA VALDES MIRANDA',
                valor: 'A'
            }
        },
        {
            id: 9,
            nroSolicitud: '1234575',
            nroCheque: '145696',
            monto: 420000.00,
            moneda: 'BOLIVIANOS',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'INDUSTRIAS METALICAS DEL SUR S.A.',
            formaPago: 'CUENTA CORRIENTE',
            motivoSolicitud: 'PAGO EQUIPAMIENTO',
            usuarioFirmante1: {
                usuario: 'JRODRIGUEZ',
                nombre: 'JORGE RODRIGUEZ VACA',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'PNAVIA',
                nombre: 'PATRICIA NAVIA CRUZ',
                valor: 'A'
            }
        },
        {
            id: 10,
            nroSolicitud: '1234576',
            nroCheque: '145697',
            monto: 200000.00,
            moneda: 'DOLARES',
            estado: 'REVERSION_SOLICITADA',
            beneficiario: 'EXPORTADORA ANDINA LTDA.',
            formaPago: 'CUENTA DE AHORRO',
            motivoSolicitud: 'PAGO EXPORTACION',
            usuarioFirmante1: {
                usuario: 'CMEDINA',
                nombre: 'CARLOS MEDINA FLORES',
                valor: 'B'
            },
            usuarioFirmante2: {
                usuario: 'SRIVERA',
                nombre: 'SOFIA RIVERA TORRES',
                valor: 'A'
            }
        }
    ];

    localStorage.setItem('chequesReversion', JSON.stringify(chequesData));
    renderChequesReversionTable();
}

function renderChequesReversionTable() {
    const chequesData = JSON.parse(localStorage.getItem('chequesReversion') || '[]');
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>NRO. DE SOLICITUD</th>
                    <th>NRO. CHEQUE</th>
                    <th>MONTO</th>
                    <th>MONEDA</th>
                    <th>ESTADO</th>
                    <th>NOMBRE(S) BENEFICIARIO(S)</th>
                    <th>FIRMAS</th>
                    <th>REVERSION</th>
                </tr>
            </thead>
            <tbody>
    `;

    chequesData.forEach(cheque => {
        const statusClass = getStatusClass(cheque.estado);
        const approveButton = cheque.estado === 'REVERSION_SOLICITADA' 
            ? `<button class="btn btn-sm btn-success" onclick="aprobarReversion(${cheque.id})" title="Aprobar Reversión">✓</button>` 
            : '';
        tableHTML += `
            <tr>
                <td>${cheque.nroSolicitud}</td>
                <td>${cheque.nroCheque}</td>
                <td>${cheque.monto.toFixed(2)}</td>
                <td>${cheque.moneda}</td>
                <td><span class="status-badge ${statusClass}">${cheque.estado}</span></td>
                <td>${cheque.beneficiario}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openDetalleModal(${cheque.id})" title="Ver Firmas">👁️</button>
                </td>
                <td>
                    ${approveButton}
                    <button class="btn btn-sm btn-warning" onclick="openReversionModal(${cheque.id})" title="Solicitar Reversión">⚡</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    $('#chequesReversionTable').html(tableHTML);
}

function openDetalleModal(chequeId) {
    const cheque = JSON.parse(localStorage.getItem('chequesReversion') || '[]')
        .find(c => c.id === chequeId);

    if (!cheque) return;

    $('#modal-title').text('Detalle de Firmas - ' + cheque.nroSolicitud);

    const modalBody = `
        <div class="detalle-firmas">
            <div class="firma-section">
                <h4>USUARIO FIRMANTE</h4>
                <div class="usuario-info">
                    <p>${cheque.usuarioFirmante1.usuario}</p>
                    <p>${cheque.usuarioFirmante1.nombre}</p>
                </div>
                <div class="valor-firma">
                    <p>VALOR</p>
                    <div class="valor-box">${cheque.usuarioFirmante1.valor}</div>
                </div>
                <div class="firma-img">
                    <!-- Add signature image here -->
                </div>
            </div>
            <div class="firma-section">
                <h4>USUARIO FIRMANTE</h4>
                <div class="usuario-info">
                    <p>${cheque.usuarioFirmante2.usuario}</p>
                    <p>${cheque.usuarioFirmante2.nombre}</p>
                </div>
                <div class="valor-firma">
                    <p>VALOR</p>
                    <div class="valor-box">${cheque.usuarioFirmante2.valor}</div>
                </div>
                <div class="firma-img">
                    <!-- Add signature image here -->
                </div>
            </div>

            
            <div class="form-row">
                <div class="form-group">
                    <label>NRO. DE SOLICITUD:</label>
                    <input type="text" value="${cheque.nroSolicitud}" readonly>
                </div>
                <div class="form-group">
                    <label>NUMERO DE CHEQUE:</label>
                    <input type="text" value="${cheque.nroCheque}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>MONTO:</label>
                    <input type="text" value="${cheque.monto.toFixed(2)}" readonly>
                </div>
                <div class="form-group">
                    <label>NOMBRE(S) BENEFICIARIO(S):</label>
                    <input type="text" value="${cheque.beneficiario}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>SOLICITANTE:</label>
                    <input type="text" value="EAVILA" readonly>
                </div>
                <div class="form-group">
                    <label>AUTORIZADOR:</label>
                     <input type="text" id="autorizadorInput" value="ECHACON">
                </div>
            </div>
            
        </div>
    `;

    $('#modal-body').html(modalBody);
    $('#modal-footer').html(`
        <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    `);

    $('#modal').show();
}

function openReversionModal(chequeId) {
    const cheque = JSON.parse(localStorage.getItem('chequesReversion') || '[]')
        .find(c => c.id === chequeId);
    
    if (!cheque) return;

    $('#modal-title').text('Reversión - ' + cheque.nroSolicitud);
    
    const modalBody = `
        <div class="reversion-form">
            <div class="form-row">
                <div class="form-group">
                    <label>NRO. DE SOLICITUD:</label>
                    <input type="text" value="${cheque.nroSolicitud}" readonly>
                </div>
                <div class="form-group">
                    <label>NUMERO DE CHEQUE:</label>
                    <input type="text" value="${cheque.nroCheque}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>MONTO:</label>
                    <input type="text" value="${cheque.monto.toFixed(2)}" readonly>
                </div>
                <div class="form-group">
                    <label>NOMBRE(S) BENEFICIARIO(S):</label>
                    <input type="text" value="${cheque.beneficiario}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>SOLICITANTE:</label>
                    <input type="text" value="EAVILA" readonly>
                </div>
                <div class="form-group">
                    <label>AUTORIZADOR:</label>
                    <div class="search-input">
                        <input type="text" id="autorizadorInput" placeholder="Buscar autorizador...">
                        <button class="btn btn-sm btn-primary" onclick="buscarAutorizador()">🔍</button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>JUSTIFICACION:</label>
                <textarea rows="4" id="justificacionReversion"></textarea>
            </div>
        </div>
    `;

    $('#modal-body').html(modalBody);
    $('#modal-footer').html(`
        <button class="btn btn-danger" onclick="enviarReversion(${chequeId})">ENVIAR</button>
        <button class="btn btn-secondary" onclick="closeModal()">CANCELAR</button>
    `);

    $('#modal').show();
}

function aprobarReversion(chequeId) {
    showConfirmModal(
        'Aprobar Reversión',
        '¿Está seguro de Aprobar la reversión?',
        () => {
            const chequesData = JSON.parse(localStorage.getItem('chequesReversion') || '[]');
            const chequeIndex = chequesData.findIndex(c => c.id === chequeId);
            if (chequeIndex !== -1) {
                chequesData[chequeIndex].estado = 'REVERTIDO';
                localStorage.setItem('chequesReversion', JSON.stringify(chequesData));
                closeModal('-confirm');
                renderChequesReversionTable();
                showAlert('Reversión aprobada exitosamente', 'success');
            }
        }
    );
}


// Add necessary search and action functions
function searchChequesReversion() {
    const nroCheque = $('#searchNroCheque').val();
    const estado = $('#searchEstado').val();
    // Implement search logic
    renderChequesReversionTable();
    showAlert('Búsqueda realizada', 'info');
}

function clearSearchChequesReversion() {
    $('#searchChequesReversionForm')[0].reset();
    renderChequesReversionTable();
    showAlert('Filtros limpiados', 'info');
}

function refreshChequesReversionData() {
    loadChequesReversionData();
    showAlert('Datos actualizados', 'success');
}

function enviarReversion(chequeId) {
    const justificacion = $('#justificacionReversion').val();
    if (!justificacion) {
        showAlert('Debe ingresar una justificación', 'warning');
        return;
    }
    
    showConfirmModal(
        'Confirmar Reversión',
        '¿Está seguro de enviar la solicitud de reversión?',
        () => {
            // Update cheque status and save
            const chequesData = JSON.parse(localStorage.getItem('chequesReversion') || '[]');
            const chequeIndex = chequesData.findIndex(c => c.id === chequeId);
            if (chequeIndex !== -1) {
                chequesData[chequeIndex].estado = 'REVERTIDO';
                localStorage.setItem('chequesReversion', JSON.stringify(chequesData));
                closeModal('-confirm');
                closeModal();
                renderChequesReversionTable();
                showAlert('Solicitud de reversión enviada exitosamente', 'success');
            }
        }
    );
}

// Add to loadChequesGerenciaCRUD function
/*if (operation === 'Reversión') {
    loadChequesReversionCRUD();
    return;
}*/