# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.network "private_network", ip: "192.168.33.34"
  config.vm.provision "ansible" do |ansible|
    ansible.limit = "vagrant"
    ansible.inventory_path = "deployment/inventory/development"
    ansible.playbook = "deployment/provision.yml"
  end

  config.exec.commands %w{weekly-review}, prepend: 'sudo service'
  config.exec.commands 'watch-log', prepend: 'sudo', env: { PATH: '$PATH:/vagrant/bin' }
  config.exec.commands %w[test run], prepend: 'npm'
end
