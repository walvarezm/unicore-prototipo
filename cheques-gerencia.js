// cheques-gerencia.js
$(document).ready(function() {
    // Inicializar datos
    initializeChequesGerenciaData();
    
    // Cargar CRUD de Cheques de Gerencia
    //loadChequesGerenciaCRUD();
});

const LOCAL_STORAGE_CHEQUES_GERENCIA = 'chequesGerencia';


// Datos iniciales
function initializeChequesGerenciaData() {
    if (!localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA)) {
        const initialData = [
            {
                id: 1,
                numeroCuenta: '10',
                tipoCuenta: 'Chequera de Gerencia M/N',
                tipoChequera: 'Chequera Empresarial',
                numeroSolicitud: 'CG-2023-0001',
                usuarioSolicitante: 'JPEREZ',
                codigoOficina: 'LP-001',
                numeroChequera: 'CG10001',
                chequeInicial: '10001',
                chequeFinal: '10148',
                hojasUtilizadas: '37',
                estado: 'SOLICITADO',
                descripcionCuenta: '10-Chequera de Gerencia M/N - BOLIVIANOS',
                estadoCuenta: 'ACTIVA',
                nombreUsuario: 'JOSE PEREZ RODRIGUEZ',
                cargoSolicitante: 'OPERADOR AUXILIAR',
                fechaHoraSolicitud: '2023-01-15 10:30:00',
                regionalSolicitante: 'La Paz',
                oficinaSolicitante: 'Oficina Central',
                motivoSolicitud: 'Solicitud inicial de chequera empresarial',
                numeroImpresiones: 0
            },
            // ... agregar más ejemplos según requerimiento
        ];
        localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(initialData));
    }

    // Inicializar paramétricas
    if (!localStorage.getItem('cuentasChequeras')) {
        const cuentas = [
            {cuenta: 10, tipoCuenta: 'Chequera de Gerencia M/N', descripcion: '10-Chequera de Gerencia M/N - BOLIVIANOS', moneda: 'BOLIVIANOS', regional: 'La Paz'},
            {cuenta: 11, tipoCuenta: 'Chequera de Gerencia M/E', descripcion: '11-Chequera de Gerencia M/E - DOLARES AMERICANOS',moneda: 'DOLARES AMERICANOS', regional: 'La Paz'},
            {cuenta: 20, tipoCuenta: 'Chequera de Gerencia M/N', descripcion: '20-Chequera de Gerencia M/N - BOLIVIANOS',moneda: 'BOLIVIANOS', regional: 'Santa Cruz'},
            {cuenta: 21, tipoCuenta: 'Chequera de Gerencia M/E', descripcion: '21-Chequera de Gerencia M/E - DOLARES AMERICANOS',moneda: 'DOLARES AMERICANOS', regional: 'Santa Cruz'},
            {cuenta: 30, tipoCuenta: 'Chequera de Gerencia M/N', descripcion: '30-Chequera de Gerencia M/N - BOLIVIANOS',moneda: 'BOLIVIANOS', regional: 'Cochabamba'},
            {cuenta: 31, tipoCuenta: 'Chequera de Gerencia M/E', descripcion: '31-Chequera de Gerencia M/E - DOLARES AMERICANOS',moneda: 'DOLARES AMERICANOS', regional: 'Cochabamba'}
        ];
        localStorage.setItem('cuentasChequeras', JSON.stringify(cuentas));
    }

    if (!localStorage.getItem('tiposChequera')) {
        const tipos = [
            {tipo:'Chequera Empresarial', cantidad: 148, unidadMedida: 'Unidades', hojasUtilizadas: '37', tipoCuenta: 'CHEQUERAS DE GERENCIA'},
            {tipo:'Chequera Personal', cantidad: 24, unidadMedida: 'Unidades', hojasUtilizadas: '6', tipoCuenta: 'CHEQUERAS DE GERENCIA'},
	        {tipo:'Chequera Personal', cantidad: 48, unidadMedida: 'Unidades', hojasUtilizadas: '12', tipoCuenta: 'CHEQUERAS DE GERENCIA'},
	        {tipo:'Chequera Empresarial', cantidad: 200, unidadMedida: 'Unidades', hojasUtilizadas: '50', tipoCuenta: 'CUENTA CORRIENTE FISCAL'}, 
	        {tipo:'Chequera Personal', cantidad: 50, unidadMedida: 'Unidades', hojasUtilizadas: '13', tipoCuenta: 'CUENTA CORRIENTE FISCAL'}
        ];
        localStorage.setItem('tiposChequera', JSON.stringify(tipos));
    }

    if (!localStorage.getItem('modulosChequesGerencia')) {
        const modulosChequesGerencia = [
            {modulo:'Solicitud', tituloPanel3: 'Solicitudes', mostrarBotonRegistro: true, estado: 'SOLICITADO', mode: 'edit'},
            {modulo:'Impresión', tituloPanel3: 'Impresión', mostrarBotonRegistro: false, estado: 'SOLICITADO|APROBADO', mode: 'print'},
            {modulo:'Reimpresión', tituloPanel3: 'Solicitudes de Reimpresión', mostrarBotonRegistro: false, estado: 'IMPRESO', mode: 'reprint'},
            {modulo:'Autorización', tituloPanel3: 'Autorización de Reimpresiones', mostrarBotonRegistro: false, estado: 'REIMPRESO', mode: 'autorize'},
            
        ];
        localStorage.setItem('modulosChequesGerencia', JSON.stringify(modulosChequesGerencia));
    }
}

// Cargar CRUD
function loadChequesGerenciaCRUD(operation) {

    console.log('operation',operation)

    // Add to loadChequesGerenciaCRUD function
    if (operation === 'Reversión') {
        loadChequesReversionCRUD();
        return;
    }


    const servicioSeleccionado = JSON.parse(localStorage.getItem('servicioSeleccionado') || {});
    //const modulosChequesGerencia = JSON.parse(localStorage.getItem('modulosChequesGerencia') || []);
    //const moduloChequesGerencia = modulosChequesGerencia.find(c => c.modulo == operation);
    const moduloChequesGerencia = servicioSeleccionado.operaciones.find(c => c.operacion == operation);

    //console.log('moduloChequesGerencia', moduloChequesGerencia);
    //localStorage.setItem('moduloChequesGerencia', JSON.stringify(moduloChequesGerencia));
    localStorage.setItem('moduloChequesGerencia', JSON.stringify(moduloChequesGerencia || {}));

    // Panel 2 - Search/Filter
    $('#panel2Content').html(`
        <form class="search-form" id="searchChequesForm">
            <div class="form-group">
                <label>Número de Cuenta:</label>
                <input type="text" id="searchNumeroCuenta" placeholder="Ej: 10">
            </div>
            <div class="form-group">
                <label>Estado:</label>
                <select id="searchEstado">
                    <option value="">Todos</option>
                    <option value="SOLICITADO">SOLICITADO</option>
                    <option value="APROBADO">APROBADO</option>
                    <option value="IMPRESO">IMPRESO</option>
                </select>
            </div>
            <div class="search-actions">
                <button type="button" class="btn btn-primary" onclick="searchChequesGerencia()">🔍 Buscar</button>
                <button type="button" class="btn btn-secondary" onclick="clearSearchChequesGerencia()">🗑️ Limpiar</button>
            </div>
        </form>
    `);

    // Panel 3 - Data List
    $('#panel3Title').text('📋 '+ moduloChequesGerencia.tituloPanel3 +' de Chequeras de Gerencia');
    $('#panel3Actions').html(`
        <button class="btn btn-success ${moduloChequesGerencia.mostrarBotonRegistro? '':' hidden-row'}" onclick="openRegistroChequeraModal()">➕ Registro de Solicitud</button>
        <button class="btn btn-info" onclick="refreshChequesGerenciaData('${moduloChequesGerencia}')">🔄 Actualizar</button>
    `);

    loadChequesGerenciaData(moduloChequesGerencia);
}

// Variables for authorization
let currentCGData = [];
let filteredCGData = [];
let currentCGPage = 1;
let ItemsCGPerPage = 10;

// Cargar datos de cheques de gerencia
function loadChequesGerenciaData(moduloChequesGerencia2 = {}) {
    const chequesData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const moduloChequesGerencia = JSON.parse(localStorage.getItem('moduloChequesGerencia') || {});

    console.log(moduloChequesGerencia);
    let estados = moduloChequesGerencia.estado.split("|");
    let mode = moduloChequesGerencia.mode;

    filteredCGData = chequesData.filter(cheque => 
        estados.includes(cheque.estado)
        //cheque.estado === estado
    );

    //filteredCGData = [...chequesData];
    renderChequesGerenciaTable(mode);
}

// Renderizar tabla
function renderChequesGerenciaTable(mode) {
    const startIndex = (currentCGPage - 1) * ItemsCGPerPage;
    const endIndex = startIndex + ItemsCGPerPage;
    const pageData = filteredCGData.slice(startIndex, endIndex);

    let tableHTML = `
        <div class="table-header-tools" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0px; background: #f8f9fa; border-radius: 5px;">
            <span>Total de registros: ${pageData.length}</span>
            <span>Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredCGData.length)} de ${filteredCGData.length} registros</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="text" id="tableSearchCheques" placeholder="Buscar solicitudes..." 
                       style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;" 
                       onkeyup="filterChequesGerenciaTable()">
                <button class="btn btn-sm btn-secondary" onclick="clearTableSearchCheques()">🗑️</button>
            </div>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Número de Solicitud</th>
                    <th>Número de Chequera</th>
                    <th>Número de Cuenta</th>
                    <th>Tipo de Cuenta</th>
                    <th>Tipo de Chequera</th>
                    <th>Usuario Solicitante</th>
                    <th>Código de Oficina</th>
                    <th>Cheque Inicial</th>
                    <th>Cheque Final</th>
                    <th>Hojas Utilizadas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageData.forEach(cheque => {
        const statusClass = getStatusClassCheque(cheque.estado);

        // Determinar qué acciones mostrar según el estado
        const showEditar = cheque.estado === 'SOLICITADO' && mode === 'edit';
        const showImprimir = ['SOLICITADO','APROBADO'].includes(cheque.estado)  && mode === 'print'; //cheque.estado === 'APROBADO';
        const showReimprimir = ['IMPRESO'].includes(cheque.estado)  && mode === 'reprint';
        const showAprobar = ['REIMPRESO','REIMPRESION'].includes(cheque.estado)  && mode === 'autorize';
        //const showEliminar = ['IMPRESO', 'REIMPRESO','REIMPRESION', 'ENTREGADO'].includes(cheque.estado);

        tableHTML += `
            <tr>
                <td>${cheque.numeroSolicitud}</td>
                <td>${cheque.numeroChequera}</td>
                <td>${cheque.numeroCuenta}</td>
                <td>${cheque.tipoCuenta}</td>
                <td>${cheque.tipoChequera}</td>
                <td>${cheque.usuarioSolicitante}</td>
                <td>${cheque.codigoOficina}</td>
                <td>${cheque.chequeInicial}</td>
                <td>${cheque.chequeFinal}</td>
                <td>${cheque.hojasUtilizadas}</td>
                <td><span class="status-badge ${statusClass}">${cheque.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editChequeGerencia(${cheque.id},'view')" title="Ver">👁️</button>
                    ${showEditar ? `<button class="btn btn-sm btn-warning" onclick="editChequeGerencia(${cheque.id},'edit')" title="Editar">✏️</button>` : ''}
                    ${showEditar ? `<button class="btn btn-sm btn-danger" onclick="deleteChequeGerencia(${cheque.id})" title="Eliminar">🗑️</button>` : ''}
                    ${showImprimir ? `<button class="btn btn-sm btn-info" onclick="imprimirChequeGerencia(${cheque.id})" title="Imprimir">🖨️</button>` : ''}
                    ${showReimprimir ? `<button class="btn btn-sm btn-secondary" onclick="reimprimirChequeGerencia(${cheque.id}, 'reprint')" title="Reimprimir">🔄</button>` : ''}
                    ${showAprobar ? `<button class="btn btn-sm btn-success" onclick="reimprimirChequeGerencia(${cheque.id}, 'autorize')" title="Aprobar">✓</button>` : ''}
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    // Add pagination
    tableHTML += renderCGPagination(mode);

    $('#content-panel-3').html(tableHTML);
}

// Render pagination
function renderCGPagination(mode) {
    const totalPages = Math.ceil(filteredCGData.length / ItemsCGPerPage);
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    paginationHTML += `<button onclick="changeChequesPage(${currentCGPage - 1},'${mode}')" ${currentCGPage === 1 ? 'disabled' : ''}>« Anterior</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentCGPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentCGPage - 2 && i <= currentCGPage + 2)) {
            paginationHTML += `<button onclick="changeChequesPage(${i},'${mode}')">${i}</button>`;
        } else if (i === currentCGPage - 3 || i === currentCGPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `<button onclick="changeChequesPage(${currentCGPage + 1},'${mode}')" ${currentCGPage === totalPages ? 'disabled' : ''}>Siguiente »</button>`;
    
    paginationHTML += '</div>';
    return paginationHTML;
}

window.refreshChequesGerenciaData = function(moduloChequesGerencia) {
    loadChequesGerenciaData(moduloChequesGerencia);
    showAlert('Datos actualizados.', 'success');
    console.log('moduloChequesGerencia',moduloChequesGerencia);
};


// Change page for giros authorization
window.changeChequesPage = function(page, mode = 'view') {
    const totalPages = Math.ceil(filteredCGData.length / ItemsCGPerPage);
    if (page >= 1 && page <= totalPages) {
        currentCGPage = page;
        renderChequesGerenciaTable(mode);
    }
};

// Abrir modal de registro
window.openRegistroChequeraModal = function() {
    $('#modal-title').text('Registro de Solicitud de Chequera de Gerencia');
    
    const modalBody = `
        <form id="chequeraForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Fecha de solicitud:</label>
                    <input type="text" id="fechaSolicitud" value="${new Date().toLocaleDateString()}" readonly>
                </div>
                <div class="form-group">
                    <label>Banco Emisor:</label>
                    <input type="text" id="bancoEmisor" value="Banco Unión S.A." readonly>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Regional Solicitante:</label>
                    <input type="text" id="regionalSolicitante" value="La Paz" readonly>
                </div>
                <div class="form-group">
                    <label>Oficina Solicitante:</label>
                    <input type="text" id="oficinaSolicitante" value="Oficina Central" readonly>
                </div>
                <div class="form-group">
                    <label>Usuario Solicitante:</label>
                    <input type="text" id="usuarioSolicitante" value="JPEREZ" readonly>
                </div>
            </div>
            
            <div class="form-group">
                <label>Motivo Solicitud (Observaciones):</label>
                <textarea id="motivoSolicitud" rows="3" placeholder="Ingrese el motivo de la solicitud"></textarea>
            </div>
            
            <div class="section-title">Características de la Chequera de Gerencia</div>
            <div id="chequerasList">
                <!-- Las chequeras se agregarán aquí dinámicamente -->
            </div>
            
            <button type="button" class="btn btn-success" onclick="addChequeraRow()">➕ Agregar Chequera</button>
        </form>
    `;
    
    $('#modal-body').html(modalBody);
    $('#modal-footer').html(`
        <button class="btn btn-primary" onclick="saveChequeraSolicitud()">💾 Solicitar Chequera de Gerencia</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    `);
    
    $('#modal').show();
};

// Agregar fila de chequera
window.addChequeraRow = function() {
    const cuentas = JSON.parse(localStorage.getItem('cuentasChequeras') || []);
    const tiposChequera = JSON.parse(localStorage.getItem('tiposChequera') || []);
    
    let cuentasOptions = '';
    cuentas.forEach(cuenta => {
        cuentasOptions += `<option value="${cuenta.cuenta}">${cuenta.descripcion}</option>`;
    });
    
    let tiposOptions = '';
    tiposChequera.forEach(tipo => {
        if (tipo.tipoCuenta === 'CHEQUERAS DE GERENCIA') {
            tiposOptions += `<option value="${tipo.tipo}">${tipo.tipo} (${tipo.cantidad} ${tipo.unidadMedida})</option>`;
        }
    });
    
    const chequeraId = Date.now(); // ID temporal
    
    const chequeraRow = `
        <div class="chequera-row" id="chequeraRow_${chequeraId}" style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <div class="form-row">
                <div class="form-group">
                    <label>Número de Cuenta:</label>
                    <select class="cuenta-select" onchange="updateTipoCuenta(this, ${chequeraId})">
                        <option value="">Seleccione una cuenta</option>
                        ${cuentasOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Tipo de Cuenta:</label>
                    <input type="text" class="tipo-cuenta" id="tipoCuenta_${chequeraId}" readonly>
                </div>
                <div class="form-group">
                    <label>Tipo de Chequera:</label>
                    <select class="tipo-chequera-select" id="tipoChequera_${chequeraId}">
                        <option value="">Seleccione tipo</option>
                        ${tiposOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Acciones:</label>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeChequeraRow(${chequeraId})">🗑️</button>
                </div>
            </div>
        </div>
    `;
    
    $('#chequerasList').append(chequeraRow);
};

// Actualizar tipo de cuenta cuando se selecciona una cuenta
window.updateTipoCuenta = function(selectElement, chequeraId) {
    const cuentaId = selectElement.value;
    const cuentas = JSON.parse(localStorage.getItem('cuentasChequeras') || []);
    const cuenta = cuentas.find(c => c.cuenta == cuentaId);
    
    if (cuenta) {
        $(`#tipoCuenta_${chequeraId}`).val(cuenta.tipoCuenta);
    }
};

// Eliminar fila de chequera
window.removeChequeraRow = function(chequeraId) {
    $(`#chequeraRow_${chequeraId}`).remove();
};

// Guardar solicitud de chequera
window.saveChequeraSolicitud = function() {
    showConfirmModal(
        'Confirmar Solicitud',
        '¿Está seguro de Registrar y Enviar la Solicitud de Chequera de Gerencia?',
        () => {
            const chequeras = [];
            $('.chequera-row').each(function() {
                const cuentaSelect = $(this).find('.cuenta-select');
                const tipoChequeraSelect = $(this).find('.tipo-chequera-select');
                
                if (cuentaSelect.val() && tipoChequeraSelect.val()) {
                    const cuentaId = cuentaSelect.val();
                    const cuentas = JSON.parse(localStorage.getItem('cuentasChequeras') || []);
                    const cuenta = cuentas.find(c => c.cuenta == cuentaId);
                    const tiposChequera = JSON.parse(localStorage.getItem('tiposChequera') || []);
                    const tipoChequera = tiposChequera.find(t => t.tipo === tipoChequeraSelect.val());
                    
                    const chequeraData = {
                        numeroCuenta: cuentaId,
                        tipoCuenta: cuenta.tipoCuenta,
                        tipoChequera: tipoChequera.tipo,
                        cantidad: tipoChequera.cantidad,
                        hojasUtilizadas: tipoChequera.hojasUtilizadas,
                        moneda: cuenta.moneda,
                        descripcionCuenta: cuenta.descripcion
                    };
                    
                    chequeras.push(chequeraData);
                }
            });
            
            if (chequeras.length === 0) {
                showAlert('Debe agregar al menos una chequera válida', 'danger');
                return;
            }
            
            const motivoSolicitud = $('#motivoSolicitud').val();
            const fechaHora = new Date().toISOString();
            
            // Obtener datos de sesión (simulados)
            const userData = {
                usuario: 'JPEREZ',
                nombre: 'JOSE PEREZ RODRIGUEZ',
                cargo: 'OPERADOR AUXILIAR',
                regional: 'La Paz',
                oficina: 'Oficina Central',
                codigoOficina: 'LP-001'
            };
            
            // Guardar cada chequera
            const chequesGerencia = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
            const nextId = Math.max(...chequesGerencia.map(c => c.id), 0) + 1;
            
            chequeras.forEach((chequera, index) => {
                const numeroSolicitud = `CG-${new Date().getFullYear()}-${String(nextId + index).padStart(4, '0')}`;
                const numeroChequera = `CG${chequera.numeroCuenta}${String(nextId + index).padStart(3, '0')}`;
                
                const newCheque = {
                    id: nextId + index,
                    numeroCuenta: chequera.numeroCuenta,
                    tipoCuenta: chequera.tipoCuenta,
                    tipoChequera: chequera.tipoChequera,
                    numeroSolicitud: numeroSolicitud,
                    usuarioSolicitante: userData.usuario,
                    codigoOficina: userData.codigoOficina,
                    numeroChequera: numeroChequera,
                    chequeInicial: numeroChequera + '001',
                    chequeFinal: numeroChequera + String(chequera.cantidad).padStart(3, '0'),
                    hojasUtilizadas: chequera.hojasUtilizadas,
                    estado: 'SOLICITADO',
                    descripcionCuenta: chequera.descripcionCuenta,
                    estadoCuenta: 'ACTIVA',
                    nombreUsuario: userData.nombre,
                    cargoSolicitante: userData.cargo,
                    fechaHoraSolicitud: fechaHora,
                    regionalSolicitante: userData.regional,
                    oficinaSolicitante: userData.oficina,
                    motivoSolicitud: motivoSolicitud,
                    numeroImpresiones: 0
                };
                
                chequesGerencia.push(newCheque);
            });
            
            localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(chequesGerencia));
            
            showAlert('Solicitud de chequera registrada exitosamente', 'success');
            closeModal();
            loadChequesGerenciaData();
        }
    );
};

// Funciones CRUD
window.viewChequeGerencia = function(id) {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const cheque = cheques.find(c => c.id === id);
    
    if (!cheque) return;
    
    $('#modal-title').text(`Detalles de Chequera: ${cheque.numeroChequera}`);
    
    const modalBody = `
        <div class="form-row">
            <div class="form-group">
                <label>Número de Solicitud:</label>
                <input type="text" value="${cheque.numeroSolicitud}" readonly>
            </div>
            <div class="form-group">
                <label>Fecha y Hora:</label>
                <input type="text" value="${cheque.fechaHoraSolicitud}" readonly>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Número de Cuenta:</label>
                <input type="text" value="${cheque.numeroCuenta}" readonly>
            </div>
            <div class="form-group">
                <label>Tipo de Cuenta:</label>
                <input type="text" value="${cheque.tipoCuenta}" readonly>
            </div>
        </div>
        
        <!-- Continuar con el resto de campos en modo solo lectura -->
        
        <div class="form-group">
            <label>Motivo de Solicitud:</label>
            <textarea rows="3" readonly>${cheque.motivoSolicitud || ''}</textarea>
        </div>
    `;
    
    $('#modal-body').html(modalBody);
    $('#modal-footer').html('<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>');
    $('#modal').show();
};

// ... continuar con las demás funciones CRUD (editar, eliminar, etc.)

// Funciones auxiliares
function getStatusClassCheque(estado) {
    switch(estado) {
        case 'SOLICITADO': return 'status-pending';
        case 'APROBADO': return 'status-approved';
        case 'IMPRESO': return 'status-printed';
        case 'REIMPRESO': return 'status-reprint';
        case 'REIMPRESION': return 'status-reprint';
        case 'RECHAZADO': return 'status-rejected';
        default: return 'status-pending';
    }
}

// cheques-gerencia.js - Funciones completas

// ... (código anterior se mantiene igual)

// Función para editar cheque de gerencia
window.editChequeGerencia = function(id, mode = 'view') {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const cheque = cheques.find(c => c.id === id);
    const moduloChequesGerencia = JSON.parse(localStorage.getItem('moduloChequesGerencia') || {});
    
    if (!cheque) return;
    
    $('#modal-title').text(`${mode == 'view'? 'Detalles de ':'Editar '} Chequera: ${cheque.numeroChequera}`);
    
    const modalBody = `
        <form id="editChequeraForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Número de Solicitud:</label>
                    <input type="text" id="editNumeroSolicitud" value="${cheque.numeroSolicitud}" readonly>
                </div>
                <div class="form-group">
                    <label>Fecha y Hora:</label>
                    <input type="text" value="${cheque.fechaHoraSolicitud}" readonly>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Número de Cuenta:</label>
                    <input type="text" id="editNumeroCuenta" value="${cheque.numeroCuenta}" readonly>
                </div>
                <div class="form-group">
                    <label>Tipo de Cuenta:</label>
                    <input type="text" id="editTipoCuenta" value="${cheque.tipoCuenta}" readonly>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de Chequera:</label>
                    <select id="editTipoChequera" ${cheque.estado !== 'SOLICITADO' || mode == 'view' ? 'disabled' : ''}>
                        ${generateTipoChequeraOptions(cheque.tipoChequera,cheque.cantidad)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Estado:</label>
                    <select id="editEstado"  ${cheque.estado !== 'SOLICITADO' || mode == 'view' ? 'disabled' : ''}>
                        ${generateEstadoOptions(cheque.estado)}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Motivo de Solicitud:</label>
                <textarea id="editMotivoSolicitud" rows="3"  ${cheque.estado !== 'SOLICITADO' || mode == 'view' ? ' readonly' : ''}>${cheque.motivoSolicitud || ''}</textarea>
            </div>
            
            ${cheque.estado === 'RECHAZADO' ? `
            <div class="form-group">
                <label>Motivo de Rechazo:</label>
                <input type="text" id="editMotivoRechazo" value="${cheque.motivoRechazo || ''}"  ${mode == 'view'? ' readonly':'' }>
            </div>
            ` : ''}
            
            ${cheque.estado === 'REIMPRESO' || cheque.estado === 'REIMPRESION' ? `
            <div class="form-group">
                <label>Motivo de Reimpresión:</label>
                <select id="editMotivoReimpresion" ${mode == 'view'? ' disabled':'' }>
                    ${generateMotivoReimpresionOptions(cheque.motivoReimpresion || '')}
                </select>
            </div>
            ` : ''}
        </form>
    `;
    
    $('#modal-body').html(modalBody);
    $('#modal-footer').html(`
        <button class="btn btn-primary ${mode == 'view'? ' hidden-row':'' }" onclick="saveEditedCheque(${id})">💾 Guardar Cambios</button>
        <button class="btn btn-success ${moduloChequesGerencia.mode == 'autorize'? '':' hidden-row' }" onclick="aprobarChequeGerencia(${id})">✓ Aprobar Reimpresion de Chequera</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    `);
    
    $('#modal').show();
};

// Función para eliminar cheque de gerencia
window.deleteChequeGerencia = function(id) {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const cheque = cheques.find(c => c.id === id);
    
    if (!cheque) return;
    
    showConfirmModal(
        'Confirmar Eliminación',
        `¿Está seguro que desea eliminar la solicitud ${cheque.numeroSolicitud}?<br>
         Chequera: ${cheque.numeroChequera} (${cheque.tipoChequera})`,
        () => {
            const updatedCheques = cheques.filter(c => c.id !== id);
            localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(updatedCheques));
            showAlert('Solicitud eliminada exitosamente', 'success');
            loadChequesGerenciaData();
            closeModal('-confirm');
        }
    );
};

// Función para guardar edición
window.saveEditedCheque = function(id) {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const chequeIndex = cheques.findIndex(c => c.id === id);
    
    if (chequeIndex === -1) return;

    const selectTipoChequera = $(`#editTipoChequera`)
    const selectedOption = selectTipoChequera.find("option:selected")
    const tipoChequeraValue = selectedOption.val();
    const cantidadChequeraValue = selectedOption.data('cantidad');

    const tiposChequera = JSON.parse(localStorage.getItem('tiposChequera') || []);
    const tipoChequera = tiposChequera.find(t => t.tipo === tipoChequeraValue && t.cantidad === cantidadChequeraValue);

    const numeroChequera = cheques[chequeIndex].numeroChequera;
    
    const editedCheque = {
        ...cheques[chequeIndex],
        //tipoChequera: $('#editTipoChequera').val(),
        tipoChequera: tipoChequera.tipo,
        cantidad: tipoChequera.cantidad,
        hojasUtilizadas: tipoChequera.hojasUtilizadas,
        //numeroChequera: numeroChequera,
        chequeInicial: numeroChequera + '001',
        chequeFinal: numeroChequera + String(tipoChequera.cantidad).padStart(3, '0'),
        estado: $('#editEstado').val(),
        motivoSolicitud: $('#editMotivoSolicitud').val(),
        motivoRechazo: $('#editMotivoRechazo') ? $('#editMotivoRechazo').val() : undefined,
        motivoReimpresion: $('#editMotivoReimpresion') ? $('#editMotivoReimpresion').val() : undefined
    };
    
    // Lógica para procesos especiales
    if (editedCheque.estado === 'APROBADO') {
        editedCheque.fechaAprobacion = new Date().toISOString();
        editedCheque.usuarioAprobador = 'ERONERO'; // Esto debería ser el usuario actual en un sistema real
    }
    
    if (editedCheque.estado === 'IMPRESO') {
        editedCheque.fechaImpresion = new Date().toISOString();
        editedCheque.usuarioImpresor = 'IMPRESOR01'; // Usuario simulado
        editedCheque.numeroImpresiones = (editedCheque.numeroImpresiones || 0) + 1;
    }
    
    if (editedCheque.estado === 'REIMPRESO' || editedCheque.estado === 'REIMPRESION') {
        editedCheque.fechaReimpresion = new Date().toISOString();
        editedCheque.usuarioReimpresor = 'IMPRESOR01'; // Usuario simulado
        editedCheque.numeroImpresiones = (editedCheque.numeroImpresiones || 0) + 1;
    }
    
    cheques[chequeIndex] = editedCheque;
    localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(cheques));
    
    showAlert('Cambios guardados exitosamente', 'success');
    closeModal();
    loadChequesGerenciaData();
};

// Funciones para procesos especiales
window.aprobarChequeGerencia = function(id) {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const chequeIndex = cheques.findIndex(c => c.id === id);
    
    if (chequeIndex === -1) return;
    
    showConfirmModal(
        'Aprobar Chequera',
        `¿Está seguro que desea aprobar la REIMPRESION de la chequera ${cheques[chequeIndex].numeroChequera}?`,
        () => {
            cheques[chequeIndex].estado = 'APROBADO';
            cheques[chequeIndex].fechaAprobacion = new Date().toISOString();
           //cheques[chequeIndex].usuarioAprobador = 'ERONERO'; // Usuario simulado
            
            localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(cheques));
            showAlert('Chequera aprobada exitosamente', 'success');
            closeModal('-confirm');
            closeModal();
            loadChequesGerenciaData();
        }
    );
};

window.imprimirChequeGerencia = function(id) {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const chequeIndex = cheques.findIndex(c => c.id === id);
    
    if (chequeIndex === -1) return;
    
    showConfirmModal(
        'Imprimir Chequera',
        `¿Está seguro que desea imprimir la chequera ${cheques[chequeIndex].numeroChequera}?`,
        () => {
            cheques[chequeIndex].estado = 'IMPRESO';
            cheques[chequeIndex].fechaImpresion = new Date().toISOString();
            cheques[chequeIndex].usuarioImpresor = 'IMPRESOR01'; // Usuario simulado
            cheques[chequeIndex].numeroImpresiones = 1;
            
            localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(cheques));
            showAlert('Chequera marcada como impresa', 'success');
            
            // Aquí iría la lógica real de impresión
            printChequeGerencia(cheques[chequeIndex]);
            
            closeModal('-confirm');
            loadChequesGerenciaData();
        }
    );
};

window.reimprimirChequeGerencia = function(id,mode = 'reprint') {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const cheque = cheques.find(c => c.id === id);
    
    if (!cheque) return;
    
    $('#modal-title').text(`${mode == 'reprint'? 'Solicitud de ':'Autorizacion de '} Reimpresión de Chequera: ${cheque.numeroChequera}`);
    
    const modalBody = `
        <form id="reimpresionForm">
            <div class="form-group">
                <label>Motivo de Reimpresión:</label>
                <input type="text" id="reimpresionMotivoA" value="${cheque.motivoReimpresion}" readonly class="${mode == 'autorize'? '' : ' hidden-row'}">
                <select id="reimpresionMotivo" required class="${mode == 'reprint'? '' : ' hidden-row'}">
                    ${generateMotivoReimpresionOptions()}
                </select>
            </div>
            <div class="form-group">
                <label>Tipo de Impresión:</label>
                <input type="text" id="reimpresionTipoA" value="${cheque.tipoImpresion}" readonly  class="${mode == 'autorize'? '' : ' hidden-row'}">
                <select id="reimpresionTipo" required  class="${mode == 'reprint'? '' : ' hidden-row'}">
                    <option value="Impresion Parcial">Impresión Parcial</option>
                    <option value="Impresion Total">Impresión Total</option>
                </select>
            </div>
            <div class="form-group">
                <label>Observaciones:</label>
                <textarea id="reimpresionObservaciones" rows="3">${cheque.observacionesReimpresion}</textarea>
            </div>

            <!-- Sección de Autorizador -->
            <div class="form-row ${mode == 'reprint'? '' : ' hidden-row'}">
                <div class="form-group" style="margin: 0; flex: 1;">
                    <label>Seleccione Autorizador</label>
                    <select id="reimpresionAutorizador" onchange="seleccionarAutorizadorCheques(this)" required>
                        ${generateAutorizadoresOptions()}
                    </select>
                </div>
            </div>
            <div class="autorizador-section" style="margin-top: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group" style="margin: 0; flex: 1;">
                        <label>Usuario:</label>
                        <input type="text" id="autorizadorUsuario"  value="${cheque.usuarioAutorizador}" readonly>
                    </div>
                    <div class="form-group" style="margin: 0; flex: 2;">
                        <label>Nombre Completo:</label>
                        <input type="text" id="autorizadorNombre"  value="${cheque.nombreUsuarioAutorizador}" readonly>
                    </div>
                    <div class="form-group" style="margin: 0; flex: 2;">
                        <label>Cargo:</label>
                        <input type="text" id="autorizadorCargo"  value="${cheque.cargoUsuarioAutorizador}" readonly>
                    </div>
                </div>
            </div>

        </form>
    `;
    
    $('#modal-body').html(modalBody);
    $('#modal-footer').html(`
        <button class="btn btn-warning ${mode == 'reprint'?'':' hidden-row'}" onclick="confirmReimpresion(${id})">🖨️ Solicitar Reimpresión para Aprobación</button>
        <button class="btn btn-success ${mode == 'autorize'?'':' hidden-row'}" onclick="aprobarChequeGerencia(${id})">✓ Aprobar Reimpresión</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    `);
    
    $('#modal').show();
};

window.confirmReimpresion = function(id) {
    const cheques = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHEQUES_GERENCIA) || []);
    const chequeIndex = cheques.findIndex(c => c.id === id);
    
    if (chequeIndex === -1) return;
    
    cheques[chequeIndex].estado = 'REIMPRESO';
    cheques[chequeIndex].fechaReimpresion = new Date().toISOString();
    cheques[chequeIndex].usuarioReimpresor = 'IMPRESOR01'; // Usuario simulado
    cheques[chequeIndex].motivoReimpresion = $('#reimpresionMotivo').val();
    cheques[chequeIndex].tipoImpresion = $('#reimpresionTipo').val();
    cheques[chequeIndex].observacionesReimpresion = $('#reimpresionObservaciones').val();
    //cheques[chequeIndex].numeroImpresiones = (cheques[chequeIndex].numeroImpresiones || 0) + 1;
    cheques[chequeIndex].usuarioAutorizador = $('#autorizadorUsuario').val();
    cheques[chequeIndex].nombreUsuarioAutorizador = $('#autorizadorNombre').val();
    cheques[chequeIndex].cargoUsuarioAutorizador = $('#autorizadorCargo').val();

    
    localStorage.setItem(LOCAL_STORAGE_CHEQUES_GERENCIA, JSON.stringify(cheques));
    
    // Aquí iría la lógica real de reimpresión
    //printChequeGerencia(cheques[chequeIndex]);
    
    showAlert('Chequera marcada para reimpresión', 'success');
    closeModal();
    loadChequesGerenciaData();
};

// Función simulada de impresión (en un sistema real se conectaría a una impresora)
function printChequeGerencia(cheque) {
    console.log('Imprimiendo chequera:', cheque);
    window.print(); // Simula la impresión del documento
    // Lógica de impresión real iría aquí
}

// Funciones auxiliares para generar opciones
function generateTipoChequeraOptions(selectedValue = '' , cantidad = 0) {
    const tipos = JSON.parse(localStorage.getItem('tiposChequera') || []);
    let options = '<option value="">Seleccione tipo</option>';
    
    tipos.forEach(tipo => {
        if (tipo.tipoCuenta === 'CHEQUERAS DE GERENCIA') {
            const selected = tipo.tipo === selectedValue && tipo.cantidad === cantidad ? 'selected' : '';
            options += `<option value="${tipo.tipo}" data-cantidad="${tipo.cantidad}" ${selected}>${tipo.tipo} (${tipo.cantidad} ${tipo.unidadMedida})</option>`;
        }
    });
    
    return options;
}

function generateEstadoOptions(selectedValue = '') {
    const estados = ['SOLICITADO', 'APROBADO', 'IMPRESO', 'REIMPRESO','REIMPRESION', 'RECHAZADO', 'ENTREGADO', 'RECEPCIONADO'];
    let options = '';
    
    estados.forEach(estado => {
        const selected = estado === selectedValue ? 'selected' : '';
        options += `<option value="${estado}" ${selected}>${estado}</option>`;
    });
    
    return options;
}

function generateMotivoReimpresionOptions(selectedValue = '') {
    const motivos = ['Fallas de Impresion', 'Fallas de Impresora', 'Fallas de Comunicacion', 'Reimpresion Extraordinaria'];
    let options = '<option value="">Seleccione motivo</option>';
    
    motivos.forEach(motivo => {
        const selected = motivo === selectedValue ? 'selected' : '';
        options += `<option value="${motivo}" ${selected}>${motivo}</option>`;
    });
    
    return options;
}
function generateAutorizadoresOptions(selectedValue = '') {
    const autorizadores = JSON.parse(localStorage.getItem('autorizadores') || '[]');
    let options = '<option value="">Seleccione Autorizador</option>';
    
    autorizadores.forEach(auth => {
        const selected = auth.id === selectedValue ? 'selected' : '';
        options += `<option value="${auth.id}" ${selected}>${auth.usuario} | ${auth.nombreCompleto} | ${auth.cargo}</option>`;
    });
    
    return options;
}

// Seleccionar autorizador
window.seleccionarAutorizadorCheques = function(selectElement) {
    const autorizadorId = selectElement.value;
    const autorizadores = JSON.parse(localStorage.getItem('autorizadores') || '[]');
    const autorizador = autorizadores.find(a => a.id == autorizadorId);
    
    if (autorizador) {
        // Cerrar modal de selección
        //closeModal();
        
        // Reabrir modal principal con datos del autorizador
        setTimeout(() => {
            //showGiroModal(tipoRegistro); // o 'archivo' según corresponda
            //openAutorizacionModal('create',tipoRegistro, 'Solicitudes');
            
            // Llenar campos del autorizador
            $('#autorizadorUsuario').val(autorizador.usuario);
            $('#autorizadorNombre').val(autorizador.nombreCompleto);
            $('#autorizadorCargo').val(autorizador.cargo);
            
            showAlert('Autorizador asignado exitosamente.', 'success');
        }, 100);
    }
};




// Actualizar la función renderChequesGerenciaTable para incluir acciones adicionales
function renderChequesGerenciaTableold(data) {
    let tableHTML = `
        <div class="table-header-tools" style="margin-bottom: 15px;">
            <span>Total de registros: ${data.length}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="text" id="tableSearchCheques" placeholder="Buscar solicitudes..." 
                       style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;" 
                       onkeyup="filterChequesGerenciaTable()">
                <button class="btn btn-sm btn-secondary" onclick="clearTableSearchCheques()">🗑️</button>
            </div>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Número de Cuenta</th>
                    <th>Tipo de Cuenta</th>
                    <th>Tipo de Chequera</th>
                    <th>Número de Solicitud</th>
                    <th>Usuario Solicitante</th>
                    <th>Código de Oficina</th>
                    <th>Número de Chequera</th>
                    <th>Cheque Inicial</th>
                    <th>Cheque Final</th>
                    <th>Hojas Utilizadas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(cheque => {
        const statusClass = getStatusClassCheque(cheque.estado);
        
        // Determinar qué acciones mostrar según el estado
        const showAprobar = cheque.estado === 'SOLICITADO';
        const showImprimir = cheque.estado === 'APROBADO';
        const showReimprimir = ['IMPRESO', 'REIMPRESO', 'ENTREGADO'].includes(cheque.estado);
        
        tableHTML += `
            <tr>
                <td>${cheque.numeroCuenta}</td>
                <td>${cheque.tipoCuenta}</td>
                <td>${cheque.tipoChequera}</td>
                <td>${cheque.numeroSolicitud}</td>
                <td>${cheque.usuarioSolicitante}</td>
                <td>${cheque.codigoOficina}</td>
                <td>${cheque.numeroChequera}</td>
                <td>${cheque.chequeInicial}</td>
                <td>${cheque.chequeFinal}</td>
                <td>${cheque.hojasUtilizadas}</td>
                <td><span class="status-badge ${statusClass}">${cheque.estado}</span></td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn btn-sm btn-primary" onclick="viewChequeGerencia(${cheque.id})" title="Ver">👁️</button>
                        <button class="btn btn-sm btn-warning" onclick="editChequeGerencia(${cheque.id})" title="Editar">✏️</button>
                        ${showAprobar ? `<button class="btn btn-sm btn-success" onclick="aprobarChequeGerencia(${cheque.id})" title="Aprobar">✓</button>` : ''}
                        ${showImprimir ? `<button class="btn btn-sm btn-info" onclick="imprimirChequeGerencia(${cheque.id})" title="Imprimir">🖨️</button>` : ''}
                        ${showReimprimir ? `<button class="btn btn-sm btn-secondary" onclick="reimprimirChequeGerencia(${cheque.id})" title="Reimprimir">🔄</button>` : ''}
                        <button class="btn btn-sm btn-danger" onclick="deleteChequeGerencia(${cheque.id})" title="Eliminar">🗑️</button>
                    </div>
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