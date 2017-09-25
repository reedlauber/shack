function requireFile(paths, current) {
	current = current || 0;

	const path = paths[current];
	
	try {
		return require(path);
	}
	catch(e) {
		if(current < paths.length) {
			return requireFile(paths, ++current);
		}
	}
}

module.exports = {
	requireFile
};
