import Gio from "gi://Gio";

const file = Gio.File.new_for_path(pkg.pkgdatadir).resolve_relative_path(
  "Library/demos/Overlay/image.png",
);

const picture = workbench.builder.get_object("picture");
picture.file = file;
