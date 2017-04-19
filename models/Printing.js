function create(connection, printingObj) {
  return connection.queryAsync(
    'INSERT INTO printings SET ?',
    printingObj
  );
}

module.exports = { create };
