import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

const launch_file = workbench.builder.get_object("launch_file");
const file_name = workbench.builder.get_object("file_name");
const file_location = workbench.builder.get_object("file_location");
const change_file = workbench.builder.get_object("change_file");
const uri_launch = workbench.builder.get_object("uri_launch");
const uri_details = workbench.builder.get_object("uri_details");
const change_uri = workbench.builder.get_object("change_uri");

Gio._promisify(Gtk.FileLauncher.prototype, "launch", "launch_finish");
Gio._promisify(
  Gtk.FileLauncher.prototype,
  "open_containing_folder",
  "open_containing_folder_finish",
);
Gio._promisify(Gtk.FileDialog.prototype, "open", "open_finish");
Gio._promisify(Gtk.UriLauncher.prototype, "launch", "launch_finish");

const file_launcher = new Gtk.FileLauncher();
const uri_launcher = new Gtk.UriLauncher();
const file = Gio.File.new_for_path(pkg.pkgdatadir).resolve_relative_path(
  "Library/demos/Launcher/workbench.txt",
);
file_launcher.set_file(file);
file_launcher.always_ask = true;

//File Launcher
launch_file.connect("clicked", () => {
  file_launcher.launch(workbench.window, null).catch(logError);
});

file_launcher.connect("notify::file", () => {
  const file_info = file_launcher.get_file();
  const details = file_info.query_info(
    "standard::*",
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS,
    null,
  );
  file_name.label = details.get_name();
});

file_location.connect("clicked", () => {
  file_launcher.open_containing_folder(workbench.window, null).catch(logError);
});

change_file.connect("clicked", () => {
  let new_file = null;

  const dialog_for_file = new Gtk.FileDialog({
    title: _("Select File"),
    modal: true,
  });
  dialog_for_file
    .open(workbench.window, null)
    .then((result) => {
      new_file = result;
    })
    .catch((err) => {
      console.debug(err.message);
    })
    .finally(() => {
      file_launcher.set_file(new_file);
    });
});

// URI Launcher
uri_launch.connect("clicked", () => {
  uri_launcher.launch(workbench.window, null).catch(logError);
});
uri_details.connect("changed", () => {
  const text = uri_details.get_text();

  uri_launcher.set_uri(text);

  try {
    uri_launch.sensitive = GLib.Uri.is_valid(text, GLib.UriFlags.NONE);
  } catch {
    uri_launch.sensitive = false;
  }
});
